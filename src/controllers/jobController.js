import Job from "../models/Job.js";

const getAllJobs = async (req, res) => {
  try {
    const query = { visible: true };
    
    const jobs = await Job.find(query)
      .populate("companyId", "name email image -_id")
      .select("-__v")
      .lean();

    return res.status(200).json({
      success: true,
      message: "Jobs fetched successfully",
      jobData: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      error: error.message
    });
  }
};

export default getAllJobs;
