import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import GroupInviteNotificationModel from "../model/Notification.model.js";

const router = express.Router();

router.use(authenticationMiddleware);

// getNotifications
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const userEmail = req.user.email;

    const [result] = await GroupInviteNotificationModel.aggregate([
      { $match: { inviteEmail: userEmail } },
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
                localField: "tenant.userId",
                foreignField: "_id",
                as: "user",
              },
            },
            { $unwind: "$user" },
            {
              $project: {
                _id: 1,
                _inviteEmail: 1,
                title: 1,
                message: 1,
                read: 1,
                inviteResponse: 1,
                tenant: {
                  _id: 1,
                  name: 1,
                },
                user: {
                  _id: 1,
                  username: 1,
                  email: 1,
                },
              },
            },
          ],
          total: [{ $count: "count" }],
        },
      },
    ]);

    const notifications = result.data;
    const total = result.total[0]?.count || 0;

    return res.status(200).json({ success: true, notifications, total });
  })
);

// Delete notification
router.delete(
  "/:notificationId",
  asyncHandler(async (req, res) => {
    const { notificationId } = req.params;
    const userEmail = req.user.email;

    await GroupInviteNotificationModel.deleteOne({
      _id: notificationId,
      inviteEmail: userEmail,
    });
    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  })
);

export default router;
