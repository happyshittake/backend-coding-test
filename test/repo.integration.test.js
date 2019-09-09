const sqlite3 = require("sqlite3").verbose();
const buildSchemas = require("../src/schemas");
const repo = require("../src/repo");
const assert = require("assert");
let db;

describe("repo integration tests", () => {
  beforeEach(done => {
    db = new sqlite3.Database(":memory:");

    db.serialize(() => {
      buildSchemas(db);
      done();
    });
  });

  describe("insert ride", () => {
    it("should not execute sql injection input", done => {
      repo
        .insertRide(db, {
          startLat: 90,
          endLat: 90,
          startLong: 90,
          endLong: 90,
          riderName: "aaaa",
          driverName: "aaaa",
          driverVehicle: "eyoo');DROP TABLE 'Rides'; -- "
        })
        .then(res => {
          db.get(
            "select name from sqlite_master where type='table' and name='Rides'",
            (err, row) => {
              assert(row.name, "Rides");
              done();
            }
          );
        });
    });
  });

  describe("get ride by id", () => {
    it("should not execute sql injection input", done => {
      repo.getRideByID(db, "eyoo');DROP TABLE 'Rides'; -- ").then(res => {
        db.get(
          "select name from sqlite_master where type='table' and name='Rides'",
          (err, row) => {
            assert(row.name, "Rides");
            done();
          }
        );
      });
    });
  });
});
