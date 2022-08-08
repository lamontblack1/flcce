module.exports = function isAuthenticatedAsAdmin(req, res, next) {
  if (req.user && req.user.userType === "admin") {
    return next();
  }
  //added this next line to try to redirect to previous page after logged in
  req.session.returnTo = req.originalUrl;
  return res.render("login", {
    message: "You must have admin credentials to view that page."
  });
};
