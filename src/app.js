"use strict";

const express = require("express");
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("../swagger.json");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const repo = require("./repo");
const error = require("./error");
const validation = require("./validation");

module.exports = (db, logger) => {
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerDocument));

  app.get("/health", (req, res) => res.send("Healthy"));

  app.post("/rides", jsonParser, async (req, res) => {
    try {
      const validated = validation.createRide(req.body);
      const lastID = await repo.insertRide(db, validated);
      const rides = await repo.getRideByID(db, lastID);
      res.send(rides);
    } catch (e) {
      logger.error(e);
      res.send(e.jsonFormat);
    }
  });

  app.get("/rides", async (req, res) => {
    const page = Number(req.query.page) ? Number(req.query.page) : 1;
    const perpage = Number(req.query.perpage) ? Number(req.query.perpage) : 30;
    try {
      const offset = (page - 1) * perpage;

      const rides = await repo.getRides(db, offset, perpage);
      if (rides.length === 0) {
        throw new error.ErrRidesNotFound("Could not find any rides");
      }

      const counts = await repo.countRides(db);

      res.send({
        total: counts,
        data: rides
      });
    } catch (err) {
      logger.error(err);
      res.send(err.jsonFormat);
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
