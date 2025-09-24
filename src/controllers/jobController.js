import Job from "../models/Job.js";

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ visible: true }).populate(
      "companyId",
      "-password"
    );

    return res.status(200).json({
      success: true,
      message: "Job fetched successfully",
      jobData: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({
      success: false,
      message: "Job fetched failed",
    });
  }
};

export default getAllJobs;
