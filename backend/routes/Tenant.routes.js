import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import {
  getTenant,
  inviteUser,
  createTenant,
  deleteTenant,
  getTenantList,
  getTenantUsers,
  responseInvite,
} from "../controllers/Tenant.controller.js";

const router = express.Router();

router.use(authenticationMiddleware);

// Get/Create tenant group
router.route("/").get(getTenantList).post(createTenant);

// Get/Delete tenant group
router.route("/:id").get(getTenant).delete(deleteTenant);

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
