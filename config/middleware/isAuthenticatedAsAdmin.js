module.exports = function isAuthenticatedAsAdmin(req, res, next) {
  if (req.user && req.user.userType === "admin") {
    return next();
  }
  return res.render("login", {
    message: "You must have admin credentials to view that page."
  });
};
