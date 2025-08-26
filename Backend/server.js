require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./src/config/db");
const quizRoutes = require("./src/routes/quizRoutes");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/userRoutes");
const errorHandler = require("./src/middleware/errorHandler");

connectDB();
const app = express();

app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(bodyParser.json());

// PUBLIC
app.use("/auth/api", authRoutes);

// PROTECTED
app.use("/api", quizRoutes);
app.use("/api/users", userRoutes);

// ERROR HANDLER
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
