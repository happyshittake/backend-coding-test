const error = require("../error");

module.exports = body => {
  const startLatitude = Number(body.start_lat);
  if (!startLatitude) {
    throw new error.ErrValidation("Start latitude is not a number");
  }

  const startLongitude = Number(body.start_long);
  if (!startLongitude) {
    throw new error.ErrValidation("Start longitude is not a number");
  }

  const endLatitude = Number(body.end_lat);
  if (!endLatitude) {
    throw new error.ErrValidation("End latitude is not a number");
  }

  const endLongitude = Number(body.end_long);
  if (!endLongitude) {
    throw new error.ErrValidation("End longitude is not a number");
  }

  const riderName = body.rider_name;
  const driverName = body.driver_name;
  const driverVehicle = body.driver_vehicle;

  if (
    startLatitude < -90 ||
    startLatitude > 90 ||
    startLongitude < -180 ||
    startLongitude > 180
  ) {
    throw new error.ErrValidation(
      "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
    );
  }

  if (
    endLatitude < -90 ||
    endLatitude > 90 ||
    endLongitude < -180 ||
    endLongitude > 180
  ) {
    throw new error.ErrValidation(
      "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
    );
  }

  if (typeof riderName !== "string" || riderName.length < 1) {
    throw new error.ErrValidation("Rider name must be a non empty string");
  }

  if (typeof driverName !== "string" || driverName.length < 1) {
    throw new error.ErrValidation("Driver name must be a non empty string");
  }

  if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
    throw new error.ErrValidation("Driver vehicle must be a non empty string");
  }

  return {
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
    driverName,
    riderName,
    driverVehicle
  };
};
