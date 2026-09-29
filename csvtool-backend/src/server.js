const app = require("./app");
const config = require("./config");

app.listen(config.port, () => {
  console.log(`csvtool-backend listening on http://localhost:${config.port}`);
});
