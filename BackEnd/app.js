const express = require("express");
const cors = require("cors");

const lessonRoutes = require("./src/routes/lessonRoutes");
const questionRoutes = require("./src/routes/questionRoutes");
const authRoutes = require("./src/routes/authRoutes");
const topicRoutes = require("./src/routes/topicRoutes");

const attemptRoutes = require("./src/routes/attemptRoutes");
const errorHandler = require("./src/middleware/errorMiddleware");

const speechRoutes = require("./src/routes/speechRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/topics", topicRoutes);
app.use("/api/attempts", attemptRoutes);    


// HEALTH CHECK
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});


// ROUTES
app.use("/api/lessons", lessonRoutes);
app.use("/api/questions", questionRoutes);


// ERROR MIDDLEWARE
app.use(errorHandler);

module.exports = app;


// SPEECH ROUTES
app.use("/api/speech",speechRoutes);

module.exports = app;
