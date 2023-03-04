const express = require("express");
const mongoose = require("mongoose");
const router = require("./routes/index");
const bodyParser = require("body-parser");

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(bodyParser.json());
app.use("/", router);

app.listen(3000, () => {
  console.log("Server started");
});
