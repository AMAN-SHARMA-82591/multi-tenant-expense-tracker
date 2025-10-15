import ApiError from "../utils/apiError.js";
import { ObjectId } from "../utils/constants.js";
import asyncHandler from "../utils/asyncHandler.js";
import TenantMembershipModel from "../model/TenantMembership.model.js";
import ConversationModel from "../model/Conversation.model.js";

export const getConversationList = asyncHandler(async (req, res) => {
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
              from: "conversations",
              localField: "tenantId",
              foreignField: "tenantId",
              as: "conversation",
            },
          },
          {
            $unwind: {
              path: "$conversation",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 1,
              role: 1,
              permissions: 1,
              joinedAt: 1,
              conversation: {
                _id: 1,
                lastMessage: 1,
                createdAt: 1,
                updatedAt: 1,
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
