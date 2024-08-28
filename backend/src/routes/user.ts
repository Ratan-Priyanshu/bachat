import { Router } from "express";
import controller from "../controllers/user";

const router = Router();

router.route("/signup").post(controller.signup);
router.route("/signin").post(controller.signin);

export default router;
