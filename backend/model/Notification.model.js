import { Schema, model } from "mongoose";

const GroupInviteNotificationSchema = new Schema(
  {
    inviteEmail: { type: String, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    // sendBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    inviteResponse: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// in future for scaling: link, expireAt, type(report, expense, system)

const GroupInviteNotificationModel = model(
  "GroupInviteNotification",
  GroupInviteNotificationSchema
);

export default GroupInviteNotificationModel;
