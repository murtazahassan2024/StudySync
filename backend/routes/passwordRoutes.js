import { Router } from "express";
import {
  forgotPassword,
  resetPassword,
  verifyAnswer,
} from "../controllers/passwordController.js";

const router = Router();

// CRUD

// GET the security question
router.get("/forgot/:email", forgotPassword);

// POST: Verify the answer and send the 200 response
router.post("/verify/:_id", verifyAnswer);

// PUT: Reset the password
router.put("/reset/:email", resetPassword);

export default router;
