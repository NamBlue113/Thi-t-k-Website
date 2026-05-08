const express = require("express");
const cors = require("cors");

const lessonRoutes = require("./src/routes/lessonRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/lessons", lessonRoutes);

module.exports = app;