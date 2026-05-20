const cors = require("cors");
const express = require("express");

const lessonRoutes = require("./src/routes/lessonRoutes");
const authRoutes = require("./src/routes/authRoutes");
const topicRoutes = require("./src/routes/topicRoutes");
const userRoutes = require("./src/routes/userRoutes");
const attemptRoutes = require("./src/routes/attemptRoutes");
const speechRoutes = require("./src/routes/speechRoutes");
const noteRoutes = require("./src/routes/noteRoutes");
const transactionRoutes = require("./src/routes/transactionRoutes");
const aiRoutes = require("./src/routes/aiRoutes");

const errorHandler = require("./src/middleware/errorMiddleware");

const app = express();
app.use(cors()); // Cho phép tất cả các nguồn (ports) truy cập vào API của bạn

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
app.use("/api/users", userRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/speech", speechRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

module.exports = app;