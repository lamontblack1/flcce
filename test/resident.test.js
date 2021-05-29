var chai = require("chai");
var chaiHttp = require("chai-http");
var server = require("../server");
var db = require("../models");
var expect = chai.expect;

// Setting up the chai http plugin
chai.use(chaiHttp);

var request;

describe("GET /api/residents", function () {
  // Before each test begins, create a new request server for testing
  // & delete all examples from the db
  beforeEach(function () {
    request = chai.request(server);
    return db.sequelize.sync({ force: true });
  });

  //resident api renders a view, does not return json, so use a duplicate residenttest route
  it("api residentstest should find all examples", function (done) {
    // Add some examples to the db to test with
    db.Resident.bulkCreate([
      { unitNo: "2503-1", ownerLastName: "Black" },
      { unitNo: "2503-2", ownerLastName: "Brown" },
      { unitNo: "2503-3", ownerLastName: "Green" },
    ]).then(function () {
      // Request the route that returns all examples
      request.get("/api/residentstest").end(function (err, res) {
        var responseStatus = res.status;
        var responseBody = res.body;

        // Run assertions on the response

        expect(err).to.be.null;

        expect(responseStatus).to.equal(200);

        expect(responseBody).to.be.an("array").that.has.lengthOf(3);

        expect(responseBody[2])
          .to.be.an("object")
          .that.includes({ unitNo: "2503-3", ownerLastName: "Green" });

        expect(responseBody[1]).to.be.an("object").that.includes({
          unitNo: "2503-2",
          ownerLastName: "Brown",
        });

        // The `done` function is used to end any asynchronous tests
        done();
      });
    });
  });
});
