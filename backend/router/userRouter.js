import express from "express";
import { registerUser, loginUser, getProfile, toggleLike } from "../controller/userController.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/profile", authMiddleware, getProfile);
userRouter.post("/toggle-like", authMiddleware, toggleLike);

export default userRouter;
