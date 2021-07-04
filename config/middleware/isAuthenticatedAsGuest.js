module.exports = function isAuthenticatedAsGuest(req, res, next) {
  if (req.user) {
    return next();
  }
  return res.render("login", {
    message: "You must login to view the list of residents."
  });
};
