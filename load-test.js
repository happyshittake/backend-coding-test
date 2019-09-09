const forever = require("forever-monitor");

const app = new forever.Monitor("index.js", {
  silent: true
});

app.start();

const artillery = forever.start(
  ["./node_modules/.bin/artillery", "run", "test.yaml"],
  {
    max: 1,
    silent: false
  }
);

artillery.on("exit", () => {
  app.stop();
});
