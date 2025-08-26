import express from "express";
import authenticationMiddleware from "../middlewares/authMiddleware";
import {
  createTenant,
  getTenant,
  getTenantUsers,
  joinTenant,
} from "../controllers/Tanant.controller";

const router = express.Router();

router.use(authenticationMiddleware);

router.post("/create", createTenant);

router.post("/join", joinTenant);

router.get("/:id", getTenant);

router.get("/:id/users", getTenantUsers);
