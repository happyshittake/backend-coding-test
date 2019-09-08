const error = require("../error");

module.exports = (db, body) =>
  new Promise((resolve, reject) => {
    db.run(
      "INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        body.startLat,
        body.startLong,
        body.endLat,
        body.endLong,
        body.riderName,
        body.driverName,
        body.driverVehicle
      ],
      function(err) {
        if (err) {
          reject(new error.ServerError(err));
          return;
        }

        resolve(this.lastID);
      }
    );
  });
