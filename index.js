"use strict";

const port = 8010;

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(":memory:");

const buildSchemas = require("./src/schemas");
const winston = require("winston");

db.serialize(() => {
  buildSchemas(db);
  const logger = winston.createLogger({
    transports: [
      new winston.transports.File({ filename: "error.log", level: "error" })
    ]
  });

  const app = require("./src/app")(db, logger);

  app.listen(port, () =>
    console.log(`App started and listening on port ${port}`)
  );
});
