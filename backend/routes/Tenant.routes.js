import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import {
  createTenant,
  createTenantGroupExpense,
  deleteTenant,
  getTenant,
  getTenantGroupExpenseList,
  getTenantList,
  getTenantUsers,
  inviteUser,
  responseInvite,
} from "../controllers/Tenant.controller.js";

const router = express.Router();

router.use(authenticationMiddleware);

// Get/Create tenant group
router.route("/").get(getTenantList).post(createTenant);

// Get/Delete tenant group
router.route("/:id").get(getTenant).delete(deleteTenant);

// Create Expense in a group
router.post("/:id/expense", createTenantGroupExpense);

// Get expense list of a group
router.get("/:id/expense", getTenantGroupExpenseList);

// Get users in a tenant group
router.get("/:id/users", getTenantUsers);

// Invite Users to join tenant group
router.post("/:id/invite", inviteUser);
// router.post("/join", joinTenant);

// Accept and Reject Invite
router.patch("/invite/:inviteId/response", responseInvite);


// // Get personal tenant information
// router.get("/personal", getPersonalTenant);

export default router;

