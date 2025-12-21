require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Route imports
const authRoutes = require("./routes/auth");
const subjectRoutes = require("./routes/subjects");
const questionRoutes = require("./routes/questions");
const quizRoutes = require("./routes/quiz");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/questions", require("./routes/questions"));
app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/materials", require("./routes/materials"));
app.use("/api/chat", require("./routes/chat"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
