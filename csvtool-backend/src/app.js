const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
