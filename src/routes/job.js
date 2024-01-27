const express = require("express");
const router = express.Router();
const { getProfile } = require("../middleware/getProfile");
const JobController = require("../controllers/job");

router.get("/jobs/unpaid", getProfile, JobController.getUnpaidJobs);
router.post("/jobs/:jobId/pay", getProfile, JobController.payToContractor);
router.post("/jobs/deposit/:userId", getProfile, JobController.depositToClient);

module.exports = router;
