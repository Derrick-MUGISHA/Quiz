const bcrypt = require("bcryptjs");
const Teacher = require("./src/models/Teachers");
const mongoose = require("mongoose");
require("./src/config/db"); // your existing DB connection

const seedAdminTeacher = async () => {
  try {
    // Wait for MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      console.log("Waiting for MongoDB connection...");
      await new Promise((resolve, reject) => {
        mongoose.connection.once("open", resolve);
        mongoose.connection.on("error", reject);
      });
    }

    // Check if admin already exists
    const existingAdmin = await Teacher.findOne({ email: "admin@school.com" });
    if (existingAdmin) {
      console.log("Admin teacher already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Admin123!", 12);

    // Create admin teacher
    const adminTeacher = new Teacher({
      name: "Derrick Mugisha",
      email: "derrickmugisha169@gmail.com",
      password: hashedPassword,
      role: "Teacher",
      permissions: ["create_quiz", "view_reports", "manage_students"],
      isEmailVerified: true,
    });

    await adminTeacher.save();
    console.log("Admin teacher seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin teacher:", error);
    process.exit(1);
  }
};

seedAdminTeacher();
