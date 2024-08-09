const getProfile = async (req, res) => {
  res.render("profile.ejs");
};
const getLogin = async (req, res) => {
  res.render("login.ejs");
};
const getSignUp = async (req, res) => {
  res.render("signup.ejs");
};
const getHome = async (req, res) => {
  res.render("home.ejs");
};
const getJobDetails = async (req, res) => {
  res.render("jobDetails.ejs");
};
const getAddJob = async (req, res) => {
  res.render("addJob.ejs");
};
const getUpdateProfileV = async (req, res) => {
  res.render("updateProfile.ejs");
};
module.exports = {
  getProfile,
  getLogin,
  getSignUp,
  getHome,
  getJobDetails,
  getAddJob,
  getUpdateProfileV,
};
