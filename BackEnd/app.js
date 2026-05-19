const express = require("express");
const cors = require("cors");

const lessonRoutes = require("./src/routes/lessonRoutes");
const authRoutes = require("./src/routes/authRoutes");
const topicRoutes = require("./src/routes/topicRoutes");
const attemptRoutes = require("./src/routes/attemptRoutes");
const speechRoutes = require("./src/routes/speechRoutes");
const aiRoutes = require("./src/routes/aiRoutes");

const errorHandler = require("./src/middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

module.exports = app;