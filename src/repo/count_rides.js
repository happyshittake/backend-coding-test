module.exports = db =>
  new Promise((resolve, reject) => {
    db.get("SELECT count(rideID) as count FROM Rides", (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row.count);
    });
  });
