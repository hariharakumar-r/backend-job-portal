import mongoose from "mongoose";

// Interview Schema
const interviewSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (v) {
          return v.getTime() > Date.now();
        },
        message: "Scheduled date must be in the future",
      },
    },
    duration: {
      type: Number,
      default: 60,
      min: [1, "Duration must be at least 1 minute"],
    }, // in minutes
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    zoomMeeting: {
      meetingName: { type: String },
      meetingId: { type: String },
      meetingNumber: { type: String },
      password: { type: String },
      joinUrl: { type: String },
      startUrl: { type: String },
    },
    notes: { type: String, trim: true },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: {
        type: String,
      },
      submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  { timestamps: true }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
