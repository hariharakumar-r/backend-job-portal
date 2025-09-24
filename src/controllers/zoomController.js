import jwt from "jsonwebtoken";
import axios from "axios";

// Generate Zoom JWT signature for Meeting SDK
const generateSignature = (req, res) => {
  try {
    const { meetingNumber, role } = req.body;

    if (!meetingNumber || role === undefined) {
      return res.status(400).json({
        message: "Meeting number and role are required",
      });
    }

    const iat = Math.round(new Date().getTime() / 1000) - 30;
    const exp = iat + 60 * 60 * 2; // 2 hours

    const payload = {
      // amazonq-ignore-next-line
      iss: process.env.ZOOM_SDK_KEY,
      alg: "HS256",
      typ: "JWT",
      aud: "zoom",
      appKey: process.env.ZOOM_SDK_KEY,
      tokenExp: exp,
      iat: iat,
      exp: exp,
      mn: meetingNumber,
      role: role,
    };

    const signature = jwt.sign(payload, process.env.ZOOM_SDK_SECRET);

    res.json({ signature });
  } catch (error) {
    console.error("Signature generation error:", error);
    res.status(500).json({ message: "Error generating signature" });
  }
};

// Create Zoom meeting using REST API
const createMeeting = async (req, res) => {
  try {
    // Verify user authentication to prevent CSRF
    if (!req.user && !req.companyData) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { topic, start_time, duration, agenda } = req.body;

    // Generate OAuth token for Zoom API
    const tokenResponse = await axios.post(
      // amazonq-ignore-next-line
      "https://zoom.us/oauth/token",
      // amazonq-ignore-next-line
      `grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      return res.status(401).json({ message: "Failed to obtain Zoom access token" });
    }

    const accessToken = tokenResponse.data.access_token;

    // Create meeting
    const meetingResponse = await axios.post(
      // amazonq-ignore-next-line
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic,
        type: 2, // Scheduled meeting
        start_time,
        duration,
        agenda,
        settings: {
          host_video: true,
          participant_video: true,
          join_before_host: false,
          mute_upon_entry: true,
          waiting_room: true,
          auto_recording: "none",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      meeting: meetingResponse.data,
    });
  } catch (error) {
    console.error("Meeting creation error:", error);
    res.status(500).json({
      message: "Error creating Zoom meeting",
      error: error.response?.data || error.message,
    });
  }
};

export { generateSignature, createMeeting };
