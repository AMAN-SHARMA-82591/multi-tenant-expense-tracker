import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware.js";
import {
  createTenant,
  deleteTenant,
  getTenant,
  getTenantList,
  getTenantUsers,
  inviteUser,
  responseInvite,
} from "../controllers/Tanant.controller.js";

const router = express.Router();

router.use(authenticationMiddleware);

router.route("/").get(getTenantList).post(createTenant);

// router.post("/join", joinTenant);

router.route("/:id").get(getTenant).delete(deleteTenant);

router.get("/:id/users", getTenantUsers);
router.post("/:id/invite", inviteUser);

// Accept and Reject Invite
router.patch("/invite/:inviteId/response", responseInvite);

export default router;
