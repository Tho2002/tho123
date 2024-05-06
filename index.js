const express = require("express");
require("dotenv").config();
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT;
const cors = require("cors");

const cookieParser = require("cookie-parser");

const database = require("./config/database");
const route = require("./api/v1/router/index.route");
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
database.connect();
route(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
