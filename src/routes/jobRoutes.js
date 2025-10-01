import express from "express";
import getAllJobs from "../controllers/jobController.js";
import { optionalAuth } from "../middlewares/auth.js";

const router = express.Router();

router.get("/all-jobs", optionalAuth, getAllJobs);

export default router;
