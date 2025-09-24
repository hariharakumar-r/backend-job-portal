import express from "express";
import { generateSignature, createMeeting } from "../controllers/zoomController.js";
import { auth } from "../middlewares/auth.js";

const router = express.Router();

// @route   POST /api/zoom/signature
// @desc    Generate Zoom Meeting SDK signature
// @access  Public
router.post("/signature", generateSignature);

// @route   POST /api/zoom/meeting
// @desc    Create Zoom meeting
// @access  Private
router.post("/meeting", auth, createMeeting);

export default router;