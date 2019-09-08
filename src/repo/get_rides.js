module.exports = (db, offset, limit) =>
  new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM Rides LIMIT ? OFFSET ? ",
      [limit, offset],
      (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(rows);
      }
    );
  });
