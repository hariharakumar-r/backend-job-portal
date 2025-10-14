import Job from "../models/Job.js";

export const getAllJobs = async (req, res) => {
  try {
    if (!Job || typeof Job.find !== 'function') {
      throw new Error('Job model is not defined or improperly imported');
    }
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

export default getAllJobs;