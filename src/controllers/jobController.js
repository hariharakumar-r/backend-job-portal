import Job from "../models/Job.js";

const getAllJobs = async (req, res) => {
  try {
    // Model uses `visible` as the flag for job visibility (not `active`).
    const query = { visible: true };

    const jobs = await Job.find(query)
      .populate("companyId", "name email image")
      .select("-__v")
      .lean();

  // Return the array directly to preserve previous API contract used by frontend
  return res.status(200).json(jobs);
  } catch (error) {
    // Log full stack to help debugging on deploy
    console.error("Error fetching jobs:", error && error.stack ? error.stack : error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      // Only include error details in development to avoid leaking internals in production
      error: process.env.NODE_ENV === 'development' ? (error && error.stack ? error.stack : String(error)) : undefined,
    });
  }
};

export default getAllJobs;
