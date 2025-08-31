import { Schema, model } from "mongoose";
import { rolePermissions, roles } from "../utils/constants.js";

const tenantMembershipSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "Tenant", required: true },
    role: {
      type: String,
      enum: roles,
      default: "member",
      required: true,
    },

    permissions: {
      type: [String],
      default: function () {
        return rolePermissions[this.role] || [];
      },
    },
    joinedAt: { type: Date, default: Date.now },
    // status: {
    //   type: String,
    //   enum: ["active", "invited", "suspended"],
    //   default: "active",
    // },
  },
  {
    strict: true,
    timestamps: true,
  }
);

const TenantMembershipModel = model("TenantMembership", tenantMembershipSchema);

export default TenantMembershipModel;
