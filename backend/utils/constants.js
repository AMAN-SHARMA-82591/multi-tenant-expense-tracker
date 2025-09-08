import mongoose from "mongoose";

export const YEAR = 2025;
export const ObjectId = (id) => (id ? new mongoose.Types.ObjectId(id) : null);
export const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id) &&
  new mongoose.Types.ObjectId(id).toString() === id;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const tenantIdRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const roles = ["admin", "owner", "member", "viewer"];
export const rolePermissions = {
  admin: [
    "create_expense",
    "view_expense",
    "edit_expense",
    "delete_expense",
    "view_reports",
    // "invite_users",
  ],
  owner: [
    "create_expense",
    "view_expense",
    "edit_expense",
    "delete_expense",
    "manage_users",
    "change_roles",
    "view_reports",
    "configure_tenant",
  ],
  member: ["create_expense", "view_own_expense", "edit_own_expense"],
  viewer: ["view_expense", "view_reports"],
};
