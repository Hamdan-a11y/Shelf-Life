const mongoose = require("mongoose");

const MONGO_URI = "mongodb+srv://muhammadhumdan43_db_user:9RHqWj4lbuf0JLc6@cluster0.cnopard.mongodb.net/shelflife?appName=Cluster0";

async function connectMongoDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

module.exports = connectMongoDB;
