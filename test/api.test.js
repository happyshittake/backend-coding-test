const request = require("supertest");

const appFactory = require("../src/app");

const assert = require("assert");
const sinon = require("sinon");
const mockdb = {
  run: function(a, b, cb) {},
  all: function(a, b, cb) {},
  each: function(a, b, cb) {},
  get: function() {}
};
const logger = {
  error: function(a) {}
};

const repo = require("../src/repo");
describe("api tests", function() {
  describe("Get /health", function() {
    let app;
    beforeEach(function(done) {
      app = appFactory(mockdb, logger);
      done();
    });

    afterEach(function(done) {
      sinon.restore();
      done();
    });

    it("should return health", function(done) {
      request(app)
        .get("/health")
        .expect("Content-Type", /text/)
        .expect(200, done);
    });
  });

  describe("Post /rides", function() {
    describe("Start latitude and longitude not between -90 - 90 and -180 to 180 degrees respectively", () => {
      let app = null;
      let mockLogger;
      beforeEach(done => {
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return validation error", () => {
        return request(app)
          .post("/rides")
          .send({
            start_lat: -100,
            end_lat: 90,
            start_long: 100,
            end_long: 90,
            rider_name: "aaaa",
            driver_name: "aaaa",
            driver_vehicle: "bbbb"
          })
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "VALIDATION_ERROR",
            message:
              "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
          })
          .then(res => {
            mockLogger.expects("error").once();
          });
      });
    });

    describe("End latitude and longitude not between -90 - 90 and -180 to 180 degrees respectively", () => {
      let app = null;
      let mockLogger;
      beforeEach(done => {
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return validation error", () => {
        return request(app)
          .post("/rides")
          .send({
            start_lat: 90,
            end_lat: -100,
            start_long: 90,
            end_long: 100,
            rider_name: "aaaa",
            driver_name: "aaaa",
            driver_vehicle: "bbbb"
          })
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "VALIDATION_ERROR",
            message:
              "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("rider name is an empty string", () => {
      let app = null;
      let mockLogger;
      beforeEach(done => {
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return validation error", () => {
        return request(app)
          .post("/rides")
          .send({
            start_lat: 90,
            end_lat: 90,
            start_long: 90,
            end_long: 90,
            rider_name: "",
            driver_name: "aaaa",
            driver_vehicle: "bbbb"
          })
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "VALIDATION_ERROR",
            message: "Rider name must be a non empty string"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("driver name is an empty string", () => {
      let app = null;
      let mockLogger;
      beforeEach(done => {
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return validation error", () => {
        return request(app)
          .post("/rides")
          .send({
            start_lat: 90,
            end_lat: 90,
            start_long: 90,
            end_long: 90,
            rider_name: "aaa",
            driver_name: "",
            driver_vehicle: "bbbb"
          })
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "VALIDATION_ERROR",
            message: "Rider name must be a non empty string"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("driver vehicle is an empty string", () => {
      let app = null;
      let mockLogger;
      beforeEach(done => {
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return validation error", () => {
        return request(app)
          .post("/rides")
          .send({
            start_lat: 90,
            end_lat: 90,
            start_long: 90,
            end_long: 90,
            rider_name: "asda",
            driver_name: "aaaa",
            driver_vehicle: ""
          })
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "VALIDATION_ERROR",
            message: "Driver vehicle must be a non empty string"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("db throws error when inserting ride", function() {
      let mockApp = null;
      let mockLogger;
      beforeEach(done => {
        sinon.stub(mockdb, "run").callsFake(function(a, b, cb) {
          cb(true);

          return this;
        });
        mockLogger = sinon.mock(logger);
        mockApp = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return internal server error error", function() {
        return request(mockApp)
          .post("/rides")
          .send({
            start_lat: 90,
            end_lat: 90,
            start_long: 90,
            end_long: 90,
            rider_name: "asda",
            driver_name: "aaaa",
            driver_vehicle: "asdasd"
          })
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "SERVER_ERROR",
            message: "Unknown error"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("db throws error when reading the last inserted ride", function() {
      let mockApp = null;
      let mockLogger;
      beforeEach(done => {
        sinon.stub(mockdb, "run").callsFake(function(a, b, cb) {
          let binded = cb.bind({ lastID: 1 });
          binded();
        });

        sinon.stub(mockdb, "all").callsFake(function(a, b, cb) {
          cb(true);
        });
        mockLogger = sinon.mock(logger);
        mockApp = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return SERVER_ERROR error", function() {
        return request(mockApp)
          .post("/rides")
          .send({
            start_lat: 90,
            end_lat: 90,
            start_long: 90,
            end_long: 90,
            rider_name: "asda",
            driver_name: "aaaa",
            driver_vehicle: "asdasd"
          })
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "SERVER_ERROR",
            message: "Unknown error"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("if all goes well should return the last inserted ride", () => {
      let app = null;

      beforeEach(done => {
        sinon.stub(mockdb, "run").callsFake(function(a, b, cb) {
          let binded = cb.bind({ lastID: 1 });
          binded();

          return this;
        });

        sinon.stub(mockdb, "all").callsFake(function(a, b, cb) {
          cb(
            false,
            JSON.parse(`
          [
              {
                  "rideID": 1,
                  "startLat": 90,
                  "startLong": 90,
                  "endLat": 90,
                  "endLong": 90,
                  "riderName": "asda",
                  "driverName": "aaaa",
                  "driverVehicle": "asdasd",
                  "created": "2019-09-07 17:43:01"
              }
          ]
          `)
          );

          return this;
        });

        app = appFactory(mockdb);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return one ride", function() {
        return request(app)
          .post("/rides")
          .send({
            start_lat: 90,
            end_lat: 90,
            start_long: 90,
            end_long: 90,
            rider_name: "asda",
            driver_name: "aaaa",
            driver_vehicle: "asdasd"
          })
          .expect("Content-Type", /json/)
          .expect(200)
          .then(function(res) {
            assert.equal(res.body[0].riderName, "asda");
            assert.equal(res.body.length, 1);
          });
      });
    });
  });

  describe("Get /rides", function() {
    describe("when db error trying to fetch rides", () => {
      let app;
      let mockLogger;
      beforeEach(done => {
        sinon.stub(mockdb, "all").callsFake((a, cb) => {
          cb(true);
        });
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return SERVER_ERROR", () => {
        return request(app)
          .get("/rides")
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "SERVER_ERROR",
            message: "Unknown error"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("when rows is empty", () => {
      let app;
      let mockLogger;
      beforeEach(done => {
        sinon.stub(mockdb, "all").callsFake((a, b, cb) => {
          cb(false, []);
        });
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return RIDES_NOT_FOUND_ERROR", () => {
        return request(app)
          .get("/rides")
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "RIDES_NOT_FOUND_ERROR",
            message: "Could not find any rides"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("when all is ok", () => {
      let app;

      beforeEach(done => {
        sinon.stub(mockdb, "all").callsFake((a, b, cb) => {
          cb(
            false,
            JSON.parse(`
          [
              {
                  "rideID": 1,
                  "startLat": 90,
                  "startLong": 90,
                  "endLat": 90,
                  "endLong": 90,
                  "riderName": "asda",
                  "driverName": "aaaa",
                  "driverVehicle": "asdasd",
                  "created": "2019-09-07 17:43:01"
              }
          ]
          `)
          );

          return this;
        });
        sinon.stub(mockdb, "get").callsFake((a, cb) => {
          cb(false, { count: 1 });
        });
        app = appFactory(mockdb);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return paginated format rides", () => {
        return request(app)
          .get("/rides")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            assert(res.body.total, 1);
            assert(res.body.data.length, 1);
          });
      });
    });

    describe("when page and perpage is set, should query with appropriate offset and limit", () => {
      let app;

      beforeEach(done => {
        sinon
          .stub(mockdb, "all")
          .withArgs(
            sinon.match.string,
            sinon.match.array.deepEquals([10, 10]),
            sinon.match.func
          )
          .callsFake((a, b, cb) => {
            cb(
              false,
              JSON.parse(`
          [
              {
                  "rideID": 1,
                  "startLat": 90,
                  "startLong": 90,
                  "endLat": 90,
                  "endLong": 90,
                  "riderName": "asda",
                  "driverName": "aaaa",
                  "driverVehicle": "asdasd",
                  "created": "2019-09-07 17:43:01"
              }
          ]
          `)
            );

            return this;
          });
        sinon.stub(mockdb, "get").callsFake((a, cb) => {
          cb(false, { count: 1 });
        });
        app = appFactory(mockdb);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return paginated format rides", () => {
        return request(app)
          .get("/rides")
          .query({ page: 2, perpage: 10 })
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            assert(res.body.total, 1);
            assert(res.body.data.length, 1);
          });
      });
    });
  });

  describe("Get /rides/{rideID}", function() {
    describe("when db error trying to fetch ride", () => {
      let app;
      let mockLogger;
      beforeEach(done => {
        sinon.stub(mockdb, "all").callsFake((a, cb) => {
          cb(true);
        });
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return SERVER_ERROR", () => {
        return request(app)
          .get("/rides/1")
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "SERVER_ERROR",
            message: "Unknown error"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("when rows is empty", () => {
      let app;
      let mockLogger;
      beforeEach(done => {
        sinon.stub(mockdb, "all").callsFake((a, cb) => {
          cb(false, []);
        });
        mockLogger = sinon.mock(logger);
        app = appFactory(mockdb, mockLogger);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return RIDES_NOT_FOUND_ERROR", () => {
        return request(app)
          .get("/rides/1")
          .expect("Content-Type", /json/)
          .expect(200, {
            error_code: "RIDES_NOT_FOUND_ERROR",
            message: "Could not find any rides"
          })
          .then(res => mockLogger.expects("error").once());
      });
    });

    describe("when all is ok", () => {
      let app;

      beforeEach(done => {
        sinon.stub(mockdb, "all").callsFake((a, cb) => {
          cb(
            false,
            JSON.parse(`
            [
                {
                    "rideID": 1,
                    "startLat": 90,
                    "startLong": 90,
                    "endLat": 90,
                    "endLong": 90,
                    "riderName": "asda",
                    "driverName": "aaaa",
                    "driverVehicle": "asdasd",
                    "created": "2019-09-07 17:43:01"
                }
            ]
            `)
          );

          return this;
        });
        app = appFactory(mockdb);
        done();
      });

      afterEach(done => {
        sinon.restore();
        done();
      });

      it("should return all rides", () => {
        return request(app)
          .get("/rides/1")
          .expect("Content-Type", /json/)
          .expect(200)
          .then(res => {
            assert(res.body.length, 1);
            assert(res.body[0].rideID, 1);
          });
      });
    });
  });
});
