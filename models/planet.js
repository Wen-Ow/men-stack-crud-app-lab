// Import Mongoose
const mongoose = require("mongoose");

// Create our Schema
const planetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  image: String,
});

// Register the model
const Planet = mongoose.model("Planet", planetSchema); // create model

module.exports = Planet;
