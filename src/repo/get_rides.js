const error = require("../error");

module.exports = (db, offset, limit) =>
  new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM Rides LIMIT ? OFFSET ? ",
      [limit, offset],
      (err, rows) => {
        if (err) {
          reject(new error.ErrServer(err));
          return;
        }

        resolve(rows);
      }
    );
  });
