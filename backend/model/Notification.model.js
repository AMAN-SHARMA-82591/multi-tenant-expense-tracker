import { Schema, model } from "mongoose";
import { minLength } from "zod/v4";

const GroupInviteNotificationSchema = new Schema(
  {
    inviteEmail: { type: String, required: true },
    // title: { type: String, required: true },
    message: {
      type: String,
      trim: true,
      required: [true, "Message is required"],
      minlength: [3, "Message must be at least 3 character"],
      maxlength: [200, "Message must be at most 200 characters"],
    },
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
