var db = require("../models");
const isAuthenticatedAsGuest = require("../config/middleware/isAuthenticatedAsGuest");
const isAuthenticatedAsAdmin = require("../config/middleware/isAuthenticatedAsAdmin");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("../config/passport");

module.exports = function (app) {
  // Get all residents
  app.get("/api/residents", isAuthenticatedAsGuest, function (req, res) {
    db.Resident.findAll({}).then(function (dbResidents) {
      res.render("residentList", { dbResidents });
    });
  });

  app.get("/api/residentstest", isAuthenticatedAsGuest, function (req, res) {
    db.Resident.findAll({}).then(function (dbResidents) {
      res.json(dbResidents);
    });
  });

  // Get all Depts
  app.get("/api/depts", function (req, res) {
    db.Dept.findAll({ order: [["dept", "ASC"]] }).then(function (dbDepts) {
      res.json(dbDepts);
    });
  });

  //create a new Dept
  app.post("/api/depts", isAuthenticatedAsAdmin, function (req, res) {
    db.Dept.create(req.body).then(function (dbDepts) {
      res.json(dbDepts);
    });
  });

  //delete a dept
  app.delete("/api/depts/:id", isAuthenticatedAsAdmin, function (req, res) {
    db.Dept.destroy({ where: { id: req.params.id } }).then(function (dbDepts) {
      res.json(dbDepts);
    });
  });

  //update a dept

  //create a new subDept
  app.post("/api/subdepts", isAuthenticatedAsAdmin, function (req, res) {
    db.SubDept.create(req.body).then(function (dbSubDepts) {
      res.json(dbSubDepts);
    });
  });

  // Get all subDepts with dept name included
  //THIS is how you order by a column that comes from an include!!!
  app.get("/api/subdepts", function (req, res) {
    db.SubDept.findAll({
      include: [db.Dept],
      order: [
        [db.Dept, "dept", "ASC"],
        ["subDept", "ASC"]
      ]
    }).then(function (dbSubDepts) {
      res.json(dbSubDepts);
    });
  });

  // Get all subDepts with dept name included
  app.get("/api/subdeptsbydept/:deptId", function (req, res) {
    const deptId = parseInt(req.params.deptId);
    const objWhere = { deptId: deptId };
    db.SubDept.findAll({
      where: objWhere,
      include: [db.Dept]
    }).then(function (dbSubDepts) {
      res.json(dbSubDepts);
    });
  });

  //create a new subDept
  app.post("/api/subdepts", isAuthenticatedAsAdmin, function (req, res) {
    db.SubDept.create(req.body).then(function (dbSubDepts) {
      //send success message, html will location.reload
      res.json(dbSubDepts);
    });
  });

  // Get all transactions (Money) with dept name included
  app.get("/api/transacts", isAuthenticatedAsAdmin, function (req, res) {
    db.Money.findAll({
      include: [db.SubDept, db.Dept, db.ForMonth],
      order: [["itemDate", "DESC"]]
    }).then(function (dbMoney) {
      res.json(dbMoney);
    });
  });

  //create a new Money
  app.post("/api/transacts", isAuthenticatedAsAdmin, function (req, res) {
    db.Money.create(req.body).then(function (dbSubDepts) {
      //send success message, html will location.reload
      res.json(dbSubDepts);
    });
  });

  // Delete a Money by id
  app.delete("/api/transacts/:id", isAuthenticatedAsAdmin, function (req, res) {
    db.Money.destroy({ where: { id: req.params.id } }).then(function (dbMoney) {
      res.json(dbMoney);
    });
  });
};
