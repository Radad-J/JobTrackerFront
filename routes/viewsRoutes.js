const express = require("express");
const router = express.Router();
const Job = require("../models/jobModel");
const { requireAuth } = require("../middelwares/authMiddelware");

const {
  getProfile,
  getLogin,
  getSignUp,
  getHome,
  getJobDetails,
  getAddJob,
  getUpdateProfileV,
} = require("../controllers/getViews");

// Ici le getJob renvoie les data en +
// le id doit se trouver dans les query params
const { getJob } = require("../controllers/jobControllers");

router.get("/login", getLogin);
router.get("/signup", getSignUp);
router.get("/profile", requireAuth, getProfile);
router.get("/home", requireAuth, getHome);
router.get("/jobDetails", requireAuth, getJob);
router.get("/addJob", requireAuth, getAddJob);
router.get("/updateProfile", requireAuth, getUpdateProfileV);
router.get("/updateJob/:id", async (req, res) => {
  res.locals.job = await Job.findById(req.params.id);
  res.render("updateJob");
});

module.exports = router;
