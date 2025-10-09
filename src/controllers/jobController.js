import Job from "../models/Job.js";

const getAllJobs = async (req, res) => {
  try {
    const query = { active: true };
    
    const jobs = await Job.find(query)
      .populate("companyId", "name email image -_id")
      .select("-__v")
      .lean();

    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default getAllJobs;
