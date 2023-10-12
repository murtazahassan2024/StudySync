import express from "express";
import {
  login,
  registerUser,
  forgotPass
} from "../controllers/userController.js";

const userRoutes = express.Router();

userRoutes.post("/", registerUser);
userRoutes.post("/login", login);
userRoutes.post("/forgotPassword", forgotPass);

export default userRoutes;
