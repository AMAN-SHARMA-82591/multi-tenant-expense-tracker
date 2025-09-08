import { z } from "zod/v4";
import asyncHandler from "../utils/asyncHandler.js";
import {
  inviteResponseSchema,
  tenantSchema,
  tenantUserInviteSchema,
} from "../validators/tenantSchemaValidator.js";
import TenantModel from "../model/Tenant.model.js";
import UserModel from "../model/User.model.js";
import ApiError from "../utils/apiError.js";
// import { socketIo } from "../index.js";
import TenantMembershipModel from "../model/TenantMembership.model.js";
import GroupInviteNotificationModel from "../model/Notification.model.js";
import ExpenseModel from "../model/Expense.model.js";
import { ObjectId } from "../utils/constants.js";

export const getTenant = asyncHandler(async (req, res) => {
  const tenantDetails = await TenantModel.findOne({
    userId: req.uid,
  }).lean();
  return res.status(200).json({
    success: true,
    data: tenantDetails,
  });
});

export const getTenantList = asyncHandler(async (req, res) => {
  const tenantGroupList = await TenantModel.find({
    userId: req.uid,
    type: "group",
  })
    .sort({ name: 1 })
    .lean();
  return res.status(200).json({
    success: true,
    data: { group: tenantGroupList, total: tenantGroupList.length },
  });
});

export const getTenantUsers = asyncHandler(async (req, res) => {});

export const getTenantGroupExpenseList = asyncHandler(async (req, res) => {
  const tenantId = req.params.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const isTenantGroupExists = await TenantModel.findOne({
    _id: tenantId,
    userId: req.uid,
    type: "group",
  })
    .lean()
    .select("_id");
  if (!isTenantGroupExists) {
    throw new ApiError("Tenant group not found", 404);
  }

  const [result] = await ExpenseModel.aggregate([
    {
      $match: {
        createdBy: ObjectId(req.uid),
        tenantId: ObjectId(tenantId),
      },
    },
    {
      $facet: {
        expenses: [{ $sort: { date: -1 } }, { $skip: skip }, { $limit: limit }],
        total: [{ $count: "count" }],
      },
    },
  ]);
  const expenseList = result.expenses;
  const total = result.total[0]?.count || 0;
  res.status(200).json({
    success: true,
    message: "Expense list",
    data: {
      expenseList,
      total,
    },
  });
});

export const createTenant = asyncHandler(async (req, res) => {
  const { data, error, success } = tenantSchema.safeParse(req.body);
  if (!success) {
    return res
      .status(400)
      .json({ success: false, error: z.flattenError(error).fieldErrors });
  }
  const { name } = data;
  // To check if a particular user has already created a new tenant group with similar name
  const isTenantExist = await TenantModel.findOne({
    name,
    userId: req.uid,
    type: "group",
  }).lean();
  if (isTenantExist) {
    throw new ApiError("Tenant group already exist with similar name", 400);
  }

  const newTenant = await TenantModel.create({
    name,
    userId: req.uid,
    type: "group",
  });

  await TenantMembershipModel.create({
    tenantId: newTenant._id,
    userId: req.uid,
    role: "owner",
  });
  return res.status(201).json({
    success: true,
    message: "Tenant group created successfully",
    data: newTenant,
  });
});

// To create expense in a group
export const createTenantGroupExpense = asyncHandler(async (req, res) => {
  const tenantId = req.params.id;
  res.end();
});

export const deleteTenant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const isTenantExist = await TenantModel.findOne({
    _id: id,
    userId: req.uid,
    type: "group",
  })
    .lean()
    .select("_id");
  if (!isTenantExist) {
    throw new ApiError("Tenant group not found", 404);
  }

  await TenantModel.deleteOne({ _id: id });

  return res.status(201).json({
    success: true,
    message: "Tenant group successfully deleted",
  });
});

export const inviteUser = asyncHandler(async (req, res) => {
  const initiatorId = req.uid;
  const { id: tenantId } = req.params;
  const { success, data, error } = tenantUserInviteSchema.safeParse(req.body);
  if (!success) {
    return res
      .status(400)
      .json({ success: false, error: z.flattenError(error).fieldErrors });
  }

  const { targetUserEmail, title, message } = data;
  const isTenantExist = await TenantModel.findOne({
    _id: tenantId,
    userId: initiatorId,
  })
    .lean()
    .select("_id");
  if (!isTenantExist) {
    throw new ApiError("Tenant group not found", 404);
  }

  // Validate initiator is owner of the tenant group
  const initiatorMembership = await TenantMembershipModel.findOne({
    tenantId,
    userId: initiatorId,
    role: "owner",
  })
    .lean()
    .select("_id");

  if (!initiatorMembership) {
    return res.status(403).json({ error: "Not authorized" });
  }

  // Validate user if email is registered or not.
  const isUserExist = await UserModel.findOne({ email: targetUserEmail })
    .select("_id")
    .lean();
  if (!isUserExist) {
    throw new ApiError(`User with email: ${targetUserEmail} not found`, 404);
  }

  const isGroupInviteNotificationExist =
    await GroupInviteNotificationModel.findOne({
      inviteEmail: targetUserEmail,
    })
      .lean()
      .select("_id");
  if (isGroupInviteNotificationExist) {
  }

  // Create notification
  const notification = await GroupInviteNotificationModel.create({
    title,
    message,
    tenantId,
    read: false,
    // sendBy: initiatorId,
    inviteResponse: "pending",
    inviteEmail: targetUserEmail,
  });

  // Emit via socket if online
  // const socketId = emailSocketMap.get(targetUserEmail);
  // if (socketId) {
  //   socketIo.to(socketId).emit("notification", notification);
  // }

  return res.status(200).json({
    success: true,
    message: `Notification sent to ${targetUserEmail}`,
    notification,
  });
});

// Accept Invite for a particlar tenant Group
export const responseInvite = asyncHandler(async (req, res) => {
  const { inviteId } = req.params;
  const userId = req.uid;
  const { success, data } = inviteResponseSchema.safeParse(req.body);
  if (!success) {
    throw new ApiError("Invalid invite response", 400);
  }
  const { responseType } = data;

  const isInviteSent = await GroupInviteNotificationModel.findOne({
    _id: inviteId,
  }).lean();

  // If there's no invite sent.
  if (!isInviteSent) {
    throw new ApiError("Invite not found", 404);
  }
  // If user has already accepted/rejected the invite.
  if (isInviteSent.inviteResponse !== "pending") {
    throw new ApiError("Invite already responded", 400);
  }

  if (responseType === "accepted") {
    // Check if user already joined tenant group.
    const isUserAlreadyMember = await TenantMembershipModel.findOne({
      tenantId: isInviteSent.tenantId,
      userId: userId,
    }).lean();

    if (isUserAlreadyMember) {
      throw new ApiError("User is already a member of this tenant group", 400);
    }

    await TenantMembershipModel.create({
      tenantId: isInviteSent.tenantId,
      userId: userId,
      role: "member",
    });

    await GroupInviteNotificationModel.updateOne(
      { _id: inviteId },
      { inviteResponse: "accepted" }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully joined the tenant group",
    });
  } else {
    await GroupInviteNotificationModel.updateOne(
      { _id: inviteId },
      { inviteResponse: "rejected" }
    );

    return res.status(200).json({
      success: true,
      message: "Invite successfully rejected",
    });
  }
});

export const joinTenant = asyncHandler(async (req, res) => {});
