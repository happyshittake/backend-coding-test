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

  app.get("/rides/:id", async (req, res) => {
    try {
      const rides = await repo.getRideByID(db, Number(req.params.id));
      if (rides.length === 0) {
        throw new error.ErrRidesNotFound("Could not find any rides");
      }

      res.send(rides);
    } catch (e) {
      logger.error(e);
      res.send(e.jsonFormat);
    }
  });

  return app;
};
