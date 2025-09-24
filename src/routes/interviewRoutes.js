import express from "express";
import { auth } from "../middlewares/auth.js";
import Interview from "../models/Interview.js";
import { createMeeting } from "../controllers/zoomController.js";

const router = express.Router();

// Schedule interview with Zoom meeting
// amazonq-ignore-next-line
router.post("/schedule", auth, async (req, res) => {
  try {
    // CSRF protection - validate token
    const csrfToken = req.headers['x-csrf-token'];
    if (!csrfToken || csrfToken !== req.session?.csrfToken) {
      return res.status(403).json({ success: false, message: "Invalid CSRF token" });
    }

    const { title, candidateId, scheduledDate, duration } = req.body;
    
    // Create Zoom meeting
    const meetingData = await createMeeting(req, res);
    
    const interview = new Interview({
      title,
      interviewer: req.user._id,
      candidate: candidateId,
      scheduledDate,
      duration,
      zoomMeeting: {
        meetingId: meetingData.meeting.id,
        password: meetingData.meeting.password,
        joinUrl: meetingData.meeting.join_url,
        startUrl: meetingData.meeting.start_url
      }
    });
    
    await interview.save();
    
    res.status(201).json({
      success: true,
      interview,
      message: "Interview scheduled successfully"
    });
  } catch (error) {
    console.error("Interview scheduling error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to schedule interview",
      error: error.message
    });
  }
});

export default router;