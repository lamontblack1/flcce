var db = require("../models");
var path = require("path");
const isAuthenticatedAsAdmin = require("../config/middleware/isAuthenticatedAsAdmin");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("../config/passport");

module.exports = function (app) {
  // Load index page
  app.get("/", function (req, res) {
    //this eventually be a login page with a monthly newsletter
    //so it should only need to return a static homepage
    // db.Resident.findAll({}).then(function (dbResidents) {
    res.render("index", {
      msg: "Forest Lakes Country Club Estates"
    });
    // });
  });

  app.get("/login", function (req, res) {
    let msg = req.flash("error")[0];
    res.render("login", {
      message: msg
    });
  });
  //passport
  app.post(
    "/login",
    passport.authenticate("local-signin", {
      successRedirect: "/api/residents",
      failureRedirect: "/login",
      failureFlash: true
    })
  );

  app.get("/signup", isAuthenticatedAsAdmin, function (req, res) {
    let msg = req.flash("error")[0];
    res.render("signup", { message: msg });
  });

  app.post(
    "/signup",
    isAuthenticatedAsAdmin,
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );

  app.get("/depts", isAuthenticatedAsAdmin, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/depts.html"));
  });

  app.get("/transact", isAuthenticatedAsAdmin, function (req, res) {
    res.sendFile(path.join(__dirname, "../public/transact.html"));
  });

  // Load example page and pass in an example by id
  // app.get("/example/:id", function (req, res) {
  //   db.Example.findOne({ where: { id: req.params.id } }).then(function (
  //     dbExample
  //   ) {
  //     res.render("example", {
  //       example: dbExample
  //     });
  //   });
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
