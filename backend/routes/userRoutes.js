import express from "express";
import {
  login, registerUser, forgotPass, getUserNameById
} from "../controllers/userController.js";

const userRoutes = express.Router();
userRoutes.post("/", registerUser);
userRoutes.post("/login", login);
userRoutes.post("/forgotPassword", forgotPass);
userRoutes.get('/:id', getUserNameById);


export default userRoutes;
