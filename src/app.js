"use strict";

const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const repo = require("./repo");

module.exports = (db, logger) => {
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerDocument));

  app.get("/health", (req, res) => res.send("Healthy"));

  app.post("/rides", jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (
      startLatitude < -90 ||
      startLatitude > 90 ||
      startLongitude < -180 ||
      startLongitude > 180
    ) {
      const errObject = {
        error_code: "VALIDATION_ERROR",
        message:
          "Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
      };
      logger.error(errObject);
      return res.send(errObject);
    }

    if (
      endLatitude < -90 ||
      endLatitude > 90 ||
      endLongitude < -180 ||
      endLongitude > 180
    ) {
      const errObject = {
        error_code: "VALIDATION_ERROR",
        message:
          "End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively"
      };
      logger.error(errObject);
      return res.send(errObject);
    }

    if (typeof riderName !== "string" || riderName.length < 1) {
      const errObject = {
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string"
      };
      logger.error(errObject);
      return res.send(errObject);
    }

    if (typeof driverName !== "string" || driverName.length < 1) {
      const errObject = {
        error_code: "VALIDATION_ERROR",
        message: "Rider name must be a non empty string"
      };
      logger.error(errObject);
      return res.send(errObject);
    }

    if (typeof driverVehicle !== "string" || driverVehicle.length < 1) {
      const errObject = {
        error_code: "VALIDATION_ERROR",
        message: "Driver vehicle must be a non empty string"
      };
      logger.error(errObject);
      return res.send(errObject);
    }

    var values = [
      req.body.start_lat,
      req.body.start_long,
      req.body.end_lat,
      req.body.end_long,
      req.body.rider_name,
      req.body.driver_name,
      req.body.driver_vehicle
    ];

    const result = db.run(
      "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values,
      function(err) {
        if (err) {
          logger.error(err);
          return res.send({
            error_code: "SERVER_ERROR",
            message: "Unknown error"
          });
        }

        db.all("SELECT * FROM Rides WHERE rideID = ?", this.lastID, function(
          err,
          rows
        ) {
          if (err) {
            logger.error(err);
            return res.send({
              error_code: "SERVER_ERROR",
              message: "Unknown error"
            });
          }

          res.send(rows);
        });
      }
    );
  });

  app.get("/rides", async (req, res) => {
    const page = Number(req.query.page) ? Number(req.query.page) : 1;
    const perpage = Number(req.query.perpage) ? Number(req.query.perpage) : 30;
    console.log(page, perpage);
    try {
      const offset = (page - 1) * perpage;

      const rides = await repo.getRides(db, offset, perpage);
      if (rides.length === 0) {
        const errObject = {
          error_code: "RIDES_NOT_FOUND_ERROR",
          message: "Could not find any rides"
        };
        logger.error(errObject);
        return res.send(errObject);
      }

      const counts = await repo.countRides(db);

      res.send({
        total: counts,
        data: rides
      });
    } catch (err) {
      logger.error(err);
      res.send({
        error_code: "SERVER_ERROR",
        message: "Unknown error"
      });
    }
  });

  app.get("/rides/:id", (req, res) => {
    db.all(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, function(
      err,
      rows
    ) {
      if (err) {
        logger.error(err);
        return res.send({
          error_code: "SERVER_ERROR",
          message: "Unknown error"
        });
      }

      if (rows.length === 0) {
        const errObject = {
          error_code: "RIDES_NOT_FOUND_ERROR",
          message: "Could not find any rides"
        };
        logger.error(errObject);
        return res.send(errObject);
      }

      res.send(rows);
    });
  });

  return app;
};
