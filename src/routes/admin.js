const express = require("express");
const router = express.Router();
const { getProfile } = require("./../middleware/getProfile");
const AdminController = require("../controllers/admin");

router.get("/admin/best-profession", getProfile, AdminController.getBestProfession);
router.get("/admin/best-clients", getProfile, AdminController.getBestClients);

module.exports = router;
