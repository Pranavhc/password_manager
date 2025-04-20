import authMiddleware from "../Middleware/Authenticate.js";
import express from "express";
import { register, login, getlogin } from "../Controllers/auth_controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// get user using jwt
router.get("/login", authMiddleware, getlogin);

export default router;