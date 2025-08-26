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

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (origin === "https://quiz-five-rho-90.vercel.app") return callback(null, true);

    if (/^https:\/\/quiz-[a-z0-9-]+\.vercel\.app$/.test(origin)) return callback(null, true);

    if (origin === "http://localhost:3000") return callback(null, true);

    return callback(new Error("Not allowed by CORS: " + origin));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.use("/auth/api", authRoutes);

app.use("/api", quizRoutes);
app.use("/api/users", userRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
