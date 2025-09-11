import { z } from "zod/v4";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import {
  inviteResponseSchema,
  tenantSchema,
  tenantUserInviteSchema,
} from "../validators/tenantSchemaValidator.js";
import ApiError from "../utils/apiError.js";
import UserModel from "../model/User.model.js";
import TenantModel from "../model/Tenant.model.js";
import ExpenseModel from "../model/Expense.model.js";
// import { socketIo } from "../index.js";
import TenantMembershipModel from "../model/TenantMembership.model.js";
import GroupInviteNotificationModel from "../model/Notification.model.js";
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
  const userId = req.uid;

  const [result] = await TenantMembershipModel.aggregate([
    {
      $match: { userId: ObjectId(userId) },
    },
    {
      $facet: {
        data: [
          {
            $lookup: {
              from: "tenants",
              localField: "tenantId",
              foreignField: "_id",
              as: "tenant",
            },
          },
          { $unwind: "$tenant" },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              _id: 1,
              role: 1,
              permissiona: 1,
              joinedAt: 1,
              user: {
                _id: 1,
                username: 1,
                email: 1,
              },
              tenant: {
                _id: 1,
                name: 1,
                type: 1,
                description: 1,
                createdAt: 1,
              },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const data = result.data;
  const total = result.totalCount[0]?.count || 0;
  return res.status(200).json({
    success: true,
    data,
    total,
  });
});

export const getTenantUsers = asyncHandler(async (req, res) => {
  const { id: tenantId } = req.params;
  const userId = req.uid;
  const [result] = await TenantMembershipModel.aggregate([
    {
      $match: {
        tenantId: ObjectId(tenantId),
        userId: { $ne: ObjectId(userId) },
      },
    },
    {
      $facet: {
        data: [
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          { $unwind: "$user" },
          {
            $project: {
              _id: 1,
              role: 1,
              joinedAt: 1,
              user: {
                _id: 1,
                username: 1,
                email: 1,
              },
            },
          },
        ],
        totalCount: [{ $count: "count" }],
      },
    },
  ]);

  const data = result.data;
  const total = result.totalCount[0]?.count || 0;
  return res.status(200).json({
    success: true,
    data,
    total,
  });
});

export const createTenant = asyncHandler(async (req, res) => {
  const { data, error, success } = tenantSchema.safeParse(req.body);
  if (!success) {
    return res
      .status(400)
      .json({ success: false, error: z.flattenError(error).fieldErrors });
  }
  const { name, description } = data;
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
    type: "group",
    userId: req.uid,
    description,
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

export const deleteTenant = asyncHandler(async (req, res) => {
  const { id: tenantId } = req.params;
  const session = await mongoose.startSession();
  session.startTransaction();

  const isTenantExist = await TenantModel.findOne({
    _id: tenantId,
    userId: req.uid,
    type: "group",
  })
    .lean()
    .select("_id");
  if (!isTenantExist) {
    await session.abortTransaction();
    await session.endSession();
    throw new ApiError("Tenant group not found", 404);
  }

  const tenantGroupExpenseList = await ExpenseModel.find({
    tenantId,
  })
    .lean()
    .select("_id");
  const tenantGroupExpenseIds = tenantGroupExpenseList.map(
    (expense) => expense._id
  );

  if (tenantGroupExpenseIds.length) {
    await ExpenseModel.deleteMany({
      _id: { $in: tenantGroupExpenseIds },
    }).session(session);
  }

  const tenantMembers = await TenantMembershipModel.find({
    tenantId,
    userId: req.uid,
  })
    .lean()
    .select("_id");
  const tenantMembersIds = tenantMembers.map((member) => member._id);
  if (tenantMembersIds.length) {
    await TenantMembershipModel.deleteMany({
      tenantId,
      _id: { $in: tenantMembersIds },
    }).session(session);
  }
  await TenantModel.deleteOne({ _id: tenantId }).session(session);

  await session.commitTransaction();
  await session.endSession();

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

  const { email, message } = data;

  if (req.user.email === email) {
    throw new ApiError("You cannot invite yourself", 400);
  }
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
  const isUserExist = await UserModel.findOne({ email }).select("_id").lean();
  if (!isUserExist) {
    throw new ApiError(`User with email: ${email} not found`, 404);
  }

  const isGroupInviteNotificationExist =
    await GroupInviteNotificationModel.findOne({
      inviteEmail: email,
    })
      .lean()
      .select("_id");
  if (isGroupInviteNotificationExist) {
  }

  // Create notification
  const notification = await GroupInviteNotificationModel.create({
    message,
    tenantId,
    read: false,
    // sendBy: initiatorId,
    inviteResponse: "pending",
    inviteEmail: email,
  });

  // Emit via socket if online
  // const socketId = emailSocketMap.get(email);
  // if (socketId) {
  //   socketIo.to(socketId).emit("notification", notification);
  // }

  return res.status(200).json({
    success: true,
    message: `Notification sent to ${email}`,
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
      { inviteResponse: "accepted", read: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully joined the tenant group",
    });
  } else {
    await GroupInviteNotificationModel.updateOne(
      { _id: inviteId },
      { inviteResponse: "rejected", read: true }
    );

    return res.status(200).json({
      success: true,
      message: "Invite successfully rejected",
    });
  }
});

export const joinTenant = asyncHandler(async (req, res) => {});
