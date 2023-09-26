import express from "express";
import {
  login,
  registerUser,
  forgotPass
} from "../controllers/userController.js";
// creating apis
const userRoutes = express.Router();

//API endpoint for creating a new user
// POST Request for creating a user
//Route /api/users
userRoutes.post("/", registerUser);

//Log in Api
//Request type POST
//Route /api/users/login

//whenever we call a function that returns a promise,
//for that promise to be resolved, we have to wait using await keyword

// function().then(...)

userRoutes.post("/login", login);
userRoutes.post("/forgotPassword", forgotPass);


export default userRoutes;
