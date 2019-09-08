const validation = require("../src/validation");
const assert = require("assert");
const error = require("../src/error");
describe("validation tests", () => {
  describe("create ride validation", () => {
    describe("if start_lat field is not a number", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "abc"
            }),
          error.ErrValidation,
          /Start latitude is not a number/
        );
      });
    });

    describe("if start_long field is not a number", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "1",
              start_long: "abc"
            }),
          error.ErrValidation,
          /Start longitude is not a number/
        );
      });
    });

    describe("if end_lat field is not a number", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "1",
              start_long: "2",
              end_lat: "abc"
            }),
          error.ErrValidation,
          /End latitude is not a number/
        );
      });
    });

    describe("if end_long field is not a number", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "1",
              start_long: "2",
              end_lat: "3",
              end_long: "abcd"
            }),
          error.ErrValidation,
          /End longitude is not a number/
        );
      });
    });

    describe("if Start latitude and longitude not between -90 - 90 and -180 to 180 degrees respectively", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "-100",
              start_long: "200",
              end_lat: "3",
              end_long: "4"
            }),
          error.ErrValidation,
          /Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively/
        );
      });
    });

    describe("if End latitude and longitude not between -90 - 90 and -180 to 180 degrees respectively", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "20",
              start_long: "20",
              end_lat: "-100",
              end_long: "300"
            }),
          error.ErrValidation,
          /End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively/
        );
      });
    });

    describe("if riderName not a valid string", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "1",
              start_long: "2",
              end_lat: "3",
              end_long: "4",
              rider_name: ""
            }),
          error.ErrValidation,
          /Rider name must be a non empty string/
        );
      });
    });

    describe("if driverName not a valid string", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "1",
              start_long: "2",
              end_lat: "3",
              end_long: "4",
              rider_name: "aaa",
              driver_name: ""
            }),
          error.ErrValidation,
          /Driver name must be a non empty string/
        );
      });
    });

    describe("if driverVehicle not a valid string", () => {
      it("should throws error validation", () => {
        assert.throws(
          () =>
            validation.createRide({
              start_lat: "1",
              start_long: "2",
              end_lat: "3",
              end_long: "4",
              rider_name: "adsad",
              driver_name: "bbb",
              driver_vehicle: ""
            }),
          error.ErrValidation,
          /Driver vehicle must be a non empty string/
        );
      });
    });

    describe("if all fields are ok", () => {
      it("should return validated object", () => {
        assert(
          validation.createRide({
            start_lat: "1.2",
            start_long: "2.3",
            end_lat: "3",
            end_long: "4",
            rider_name: "a",
            driver_name: "b",
            driver_vehicle: "c"
          }),
          {
            startLat: 1.2,
            startLong: 2.3,
            endLat: 3,
            endLong: 4,
            riderName: "a",
            driverName: "b",
            driverVehicle: "c"
          }
        );
      });
    });
  });
});
