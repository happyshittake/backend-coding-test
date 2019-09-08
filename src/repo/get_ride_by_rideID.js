const error = require("../error");

module.exports = (db, rideID) =>
  new Promise((resolve, reject) => {
    db.all("SELECT * FROM Rides WHERE rideID = ?", rideID, (err, rows) => {
      if (err) {
        reject(new error.ServerError(err));
        return;
      }

      resolve(rows);
    });
  });
