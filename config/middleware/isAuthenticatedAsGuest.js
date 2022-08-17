module.exports = function isAuthenticatedAsGuest(req, res, next) {
  if (req.user) {
    return next();
  }
  //added this next line to try to redirect to previous page after logged in
  req.session.returnTo = req.originalUrl;
  return res.render("login", {
    message: "You must login to view the list of residents."
  });
};
