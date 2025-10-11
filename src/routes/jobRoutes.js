import express from "express";
import getAllJobs from "../controllers/jobController.js";

const router = express.Router();

router.get('/all-jobs', async (req, res, next) => {
  try {
    console.log('Fetching all jobs...');
    await getAllJobs(req, res, next);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    next(error);
  }
});

export default router;
