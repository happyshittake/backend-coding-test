const error = require("../error");

module.exports = (db, rideID) =>
  new Promise((resolve, reject) => {
    db.all("SELECT * FROM Rides WHERE rideID = ?", rideID, (err, rows) => {
      if (err) {
        reject(new error.ErrServer(err));
        return;
      }

      resolve(rows);
    });
  });
