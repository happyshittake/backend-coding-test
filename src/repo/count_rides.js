const error = require("../error");

module.exports = db =>
  new Promise((resolve, reject) => {
    db.get("SELECT count(rideID) as count FROM Rides", (err, row) => {
      if (err) {
        reject(new error.ErrServer(err));
        return;
      }

      resolve(row.count);
    });
  });
