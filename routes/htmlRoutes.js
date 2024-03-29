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
      msg: "FOREST LAKES COUNTRY CLUB ESTATES"
    });
    // });
  });

  app.get("/addPosts", isAuthenticatedAsAdmin, function (req, res) {
    res.render("addPosts", {
      // msg: "FOREST LAKES COUNTRY CLUB ESTATES"
    });
    // });
  });

  app.get("/login", function (req, res) {
    let msg = req.flash("error")[0];
    req.session.returnTo = "/api/residents";
    res.render("login", {
      message: msg
    });
  });
  //passport original
  // app.post(
  //   "/login",
  //   passport.authenticate("local-signin", {
  //     successRedirect: "/api/residents",
  //     failureRedirect: "/login",
  //     failureFlash: true
  //   })
  // );

  //trying dynamic redirect based on origin url
  app.post(
    "/login",
    passport.authenticate("local-signin", {
      failureRedirect: "/login",
      failureFlash: true
    }),
    function (req, res) {
      if (req.session.returnTo === "login") {
        req.session.returnTo = "/api/residents";
      }
      res.redirect(req.session.returnTo);
    }
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

  app.get("/condodocs", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/condoDocs.pdf"));
  });

  app.get("/leakprotocol", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/leakProtocol.pdf"));
  });

  app.get("/budgetPerformanceSheet", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/budgetPerformanceSheet.pdf"));
  });

  app.get("/yearEndBalanceSheet", function (req, res) {
    res.sendFile(path.join(__dirname, "../public/yearEndBalanceSheet.pdf"));
  });

  app.get("/getPdf/:doc", function (req, res) {
    let docToLoad = req.params.doc;
    res.sendFile(path.join(__dirname, "../public/" + docToLoad + ".pdf"));
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
