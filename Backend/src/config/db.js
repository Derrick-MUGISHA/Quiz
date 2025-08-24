const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || `mongodb+srv://derrickmugisha169:yLiuLOe1Y219EqZW@cluster0.hkctzvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
