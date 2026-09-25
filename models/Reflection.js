const mongoose = require("mongoose");

const reflectionSchema = new mongoose.Schema({
  book_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  readNumber: { type: Number, default: 1 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  mood: { type: String },
  favoriteQuote: { type: String },
  thoughts: { type: String },
  tags: [String],
  createdAt: { type: Date, default: Date.now }
});

const Reflection = mongoose.model("Reflection", reflectionSchema);

module.exports = Reflection;
