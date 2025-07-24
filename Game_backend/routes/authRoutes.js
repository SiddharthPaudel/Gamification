// routes/authRoutes.js
import express from "express";
import { signupController, loginController,getMeController,updateProfileController, getAllUsers} from "../controllers/authController.js";
import { verifyToken } from '../middleware/verifyToken.js'; // Middleware to verify JWT token

const router = express.Router();

// Signup Route
router.post("/signup", signupController);

// Login Route
router.post("/login", loginController);
router.get("/me",  getMeController);
router.put('/update-profile', verifyToken, updateProfileController);
router.get("/get-all-users", getAllUsers);
export default router;
