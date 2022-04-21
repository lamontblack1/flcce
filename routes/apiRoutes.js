var db = require("../models");
const isAuthenticatedAsGuest = require("../config/middleware/isAuthenticatedAsGuest");
const isAuthenticatedAsAdmin = require("../config/middleware/isAuthenticatedAsAdmin");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("../config/passport");

const axios = require("axios");
const cheerio = require("cheerio");
// const { notLike } = require("sequelize/types/lib/operators");
const Op = require("sequelize").Op;

module.exports = function (app) {
  // Get all residents where the unit number does not have 'prev' in it, since they are inactive
  app.get("/api/residents", isAuthenticatedAsGuest, function (req, res) {
    db.Resident.findAll({ unitNo: { [Op.notLike]: "%prev%" } }).then(function (
      dbResidents
    ) {
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

  //get the Publix Bogos
  app.get("/api/bogos", function (req, res) {
    axios
      .get(
        "https://accessibleweeklyad.publix.com/PublixAccessibility/BrowseByListing/ByCategory/?ListingSort=8&StoreID=2628706&CategoryID=5232540"
      )
      .then(function (response) {
        let item = "";
        let items = [];
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
        //each bogo item name is in h2, with class ellipsis_text. next make sure there are no duplicates - annoying!
        $("h2.ellipsis_text").each(function (i, element) {
          if (item !== $(element).text()) {
            item = $(element).text();
            items.push({
              item: item
            });
          }
        });
        res.json(items);
      });
  });

  //get the Sarasota Events
  app.get("/api/eventsOld", function (req, res) {
    // const month = [
    //   "January",
    //   "February",
    //   "March",
    //   "April",
    //   "May",
    //   "June",
    //   "July",
    //   "August",
    //   "September",
    //   "October",
    //   "November",
    //   "December"
    // ];

    // const d = new Date();
    // const monthName = month[d.getMonth()];

    // const months = {
    //   Jan: "January",
    //   Feb: "February",
    //   Mar: "March",
    //   Apr: "April",
    //   May: "May",
    //   Jun: "June",
    //   Jul: "July",
    //   Aug: "August",
    //   Sep: "September",
    //   Oct: "October",
    //   Nov: "November",
    //   Dec: "December"
    // };

    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };

    const d = new Date();
    const currentMonth = d.getMonth() + 1;
    const currentDay = d.getDate();
    let yearNum = d.getFullYear();

    let eventsList = [];

    let url = "https://www.eventbrite.com/d/fl--sarasota/events--this-weekend/";
    axios.get(url).then(function (response) {
      let item = "";
      let lastItem = "";
      let link = "";
      let dt = "";
      let eventDateUTC;
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);
      $("div.eds-event-card-content__primary-content").each(function (
        i,
        element
      ) {
        //check to make sure there are no duplicated events
        item = $(element).children("a").children("h3").text();
        item = item.substring(0, item.length / 2);
        if (item !== lastItem) {
          lastItem = item;
          if (!item.includes("spirit") && !item.includes("Metaphysical")) {
            link = $(element).children("a").attr("href");
            dt = $(element)
              .children(".eds-event-card-content__sub-title")
              .text();

            // if the date says "tomorrow" then adjust and get the date in utc format
            if (dt.substring(0, 8) === "Tomorrow") {
              eventDateUTC = new Date(
                new Date().getTime() + 24 * 60 * 60 * 1000
              );
            } else if (dt.substring(0, 5) === "Today") {
              eventDateUTC = new Date();
            } else {
              const dateSplit = dt.split(",");
              const daySplit = dateSplit[1].trim().split(" ");
              const shortMonthName = daySplit[0].trim();
              const getMonthNum = months[shortMonthName];
              if (parseInt(getMonthNum) < currentMonth) {
                yearNum += 1;
              }
              let dayNum = parseInt(daySplit[1].trim());
              if (dayNum < 10) {
                dayNum = "0" + dayNum;
              }

              //construct date here and add it as a date to the object
              eventDateUTC = new Date(yearNum, getMonthNum - 1, dayNum);
            }
            // console.log(eventDateUTC);
            eventsList.push({
              event: item,
              url: link,
              eventDate: eventDateUTC
            });
          }
        }
      });

      let url =
        "https://www.eventbrite.com/d/fl--sarasota/events--this-weekend/?page=2";
      axios.get(url).then(function (response) {
        let item = "";
        let lastItem = "";
        let link = "";
        let dt = "";
        let eventDateUTC;
        // Load the HTML into cheerio and save it to a variable
        // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
        var $ = cheerio.load(response.data);
        $("div.eds-event-card-content__primary-content").each(function (
          i,
          element
        ) {
          //check to make sure there are no duplicated events
          item = $(element).children("a").children("h3").text();
          item = item.substring(0, item.length / 2);
          if (item !== lastItem) {
            lastItem = item;
            if (!item.includes("spirit") && !item.includes("Metaphysical")) {
              link = $(element).children("a").attr("href");
              dt = $(element)
                .children(".eds-event-card-content__sub-title")
                .text();
              // if the date says "tomorrow" then adjust and get the date in utc format

              if (dt.substring(0, 8) === "Tomorrow") {
                eventDateUTC = new Date(
                  new Date().getTime() + 24 * 60 * 60 * 1000
                );
              } else if (dt.substring(0, 5) === "Today") {
                eventDateUTC = new Date();
              } else {
                const dateSplit = dt.split(",");
                const daySplit = dateSplit[1].trim().split(" ");
                const shortMonthName = daySplit[0].trim();
                const getMonthNum = months[shortMonthName];
                if (parseInt(getMonthNum) < currentMonth) {
                  yearNum += 1;
                }
                let dayNum = parseInt(daySplit[1].trim());
                if (dayNum < 10) {
                  dayNum = "0" + dayNum;
                }

                //construct date here and add it as a date to the object
                eventDateUTC = new Date(yearNum, getMonthNum - 1, dayNum);
              }
              // console.log(eventDateUTC);
              eventsList.push({
                event: item,
                url: link,
                eventDate: eventDateUTC
              });
            }
          }
        });

        eventsList.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        res.json(eventsList);
      });
      // eventsList.sort(function (a, b) {
      //   return a.eventDate - b.eventDate;
      // });
      // res.json(eventsList);
    });
  });

  app.get("/api/events", function (req, res) {
    // const month = [
    //   "January",
    //   "February",
    //   "March",
    //   "April",
    //   "May",
    //   "June",
    //   "July",
    //   "August",
    //   "September",
    //   "October",
    //   "November",
    //   "December"
    // ];

    // const d = new Date();
    // const monthName = month[d.getMonth()];

    // const months = {
    //   Jan: "January",
    //   Feb: "February",
    //   Mar: "March",
    //   Apr: "April",
    //   May: "May",
    //   Jun: "June",
    //   Jul: "July",
    //   Aug: "August",
    //   Sep: "September",
    //   Oct: "October",
    //   Nov: "November",
    //   Dec: "December"
    // };

    let eventsList = [];

    let url = "https://www.eventbrite.com/d/fl--sarasota/events--this-weekend/";
    axios.get(url).then(function (response) {
      eventsList = getEvents(response, eventsList);

      let url =
        "https://www.eventbrite.com/d/fl--sarasota/events--this-weekend/?page=2";
      axios.get(url).then(function (response) {
        eventsList = getEvents(response, eventsList);

        eventsList.sort(function (a, b) {
          return a.eventDate - b.eventDate;
        });
        // console.log(eventsList);
        res.json(eventsList);
      });
      // eventsList.sort(function (a, b) {
      //   return a.eventDate - b.eventDate;
      // });
      // res.json(eventsList);
    });
  });

  //get the Marcos Deals
  app.get("/api/marcos", function (req, res) {
    axios.get("https://www.marcos.com").then(function (response) {
      let item = "";
      let items = [];
      // Load the HTML into cheerio and save it to a variable
      // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
      var $ = cheerio.load(response.data);
      //each bogo item name is in h2, with class ellipsis_text. next make sure there are no duplicates - annoying!
      $("div.m-tile--pizza").each(function (i, element) {
        item = $(element).text();
        item = item.replace("Order Now", "");
        item = item.replace("Price & participation may vary.", "");
        item = item.replace("Limited time only. ", "");
        item = item.replace(/\s+/g, " ").trim();
        items.push({
          item: item
        });
      });
      res.json(items);
    });
  });

  function getEvents(response, eventsList) {
    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12"
    };

    const d = new Date();
    const currentMonth = d.getMonth() + 1;
    const currentDay = d.getDate();
    let yearNum = d.getFullYear();
    let item = "";
    let lastItem = "";
    let link = "";
    let dt = "";
    let eventDateUTC;
    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(response.data);
    $("div.eds-event-card-content__primary-content").each(function (
      i,
      element
    ) {
      //check to make sure there are no duplicated events
      item = $(element).children("a").children("h3").text();
      item = item.substring(0, item.length / 2);
      if (item !== lastItem) {
        lastItem = item;
        if (!item.includes("spirit") && !item.includes("Metaphysical")) {
          link = $(element).children("a").attr("href");
          dt = $(element).children(".eds-event-card-content__sub-title").text();

          // if the date says "tomorrow" then adjust and get the date in utc format
          if (dt !== "") {
            if (dt.substring(0, 8) === "Tomorrow") {
              eventDateUTC = new Date(
                new Date().getTime() + 24 * 60 * 60 * 1000
              );
            } else if (dt.substring(0, 5) === "Today") {
              eventDateUTC = new Date();
            } else {
              const dateSplit = dt.split(",");
              const daySplit = dateSplit[1].trim().split(" ");
              const shortMonthName = daySplit[0].trim();
              const getMonthNum = months[shortMonthName];
              if (parseInt(getMonthNum) < currentMonth) {
                yearNum += 1;
              }
              let dayNum = parseInt(daySplit[1].trim());
              if (dayNum < 10) {
                dayNum = "0" + dayNum;
              }

              //construct date here and add it as a date to the object
              eventDateUTC = new Date(yearNum, getMonthNum - 1, dayNum);
            }
            // console.log(eventDateUTC);
            eventsList.push({
              event: item,
              url: link,
              eventDate: eventDateUTC
            });
          }
        }
      }
    });
    return eventsList;
  }
};
