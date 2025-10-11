import Job from "../models/Job.js";

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate('company', 'companyName')
      .sort({ createdAt: -1 });
    
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: error.message
    });
  }
};
