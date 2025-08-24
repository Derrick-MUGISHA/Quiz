require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const quizRoutes = require("./routes/quizRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();

const app = express();
const allowedOrigins = ["http://localhost:3000", process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      callback(new Error("Not allowed by CORS"));
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api", quizRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
