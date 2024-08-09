const logoutUser = (req, res) => {
  res.locals.user = null;
  res.clearCookie("jwt");
  res.redirect("/login");
};

module.exports = {
  logoutUser,
};
