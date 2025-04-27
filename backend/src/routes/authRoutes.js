import express from "express";
const router = express.Router();
import controllers from "../controllers/index.controller.js";
import verifyToken from "../middlewares/authMiddleware.js";

router.post("/login", controllers.login);

router.post("/register", controllers.signup);

export default router;
