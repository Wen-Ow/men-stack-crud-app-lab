// DEPENDENCIES
const dotenv = require("dotenv"); // load environment variables
dotenv.config(); // load environment variables from .env file
const express = require("express"); // web framework for handling routes and server logic
const mongoose = require("mongoose"); // MongoDB ODM for interacting with database
const methodOverride = require("method-override"); // middleware that allows form submissions to simulate PUT and DELETE requests using query parameter "_method"

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true })); // parse form data from requests into req.body
app.use(methodOverride("_method")); // allows overriding of HTTP methods using query parameter "_method"
app.set("view engine", "ejs"); // sets EJS as the view engine for rendering HTML templates

// Database Connection
mongoose.connect(process.env.MONGODB_URI);
// log connection status to terminal on start
mongoose.connection.on("connected", () => console.log(`Connected to MongoDB ${mongoose.connection.name}.`)); // log connection to terminal
mongoose.connection.on("error", (err) => console.error("MongoDB connection error:", err)); // log connection errors to terminal
mongoose.connection.on("disconnected", () => console.log("MongoDB disconnected.")); // log disconnection to terminal

// Import Planet Model
const Planet = require("./models/planet.js"); // import the Planet model

// Routes

// Get/Test Route
// app.get("/", async (req, res) => {
//     res.send("This is my planets app.");
// });

// I. = Index = GET /planets - Display all planets
app.get("/planets", async (req, res) => {
  try {
    const planets = await Planet.find({}); // fetch all planets from database
    res.render("index.ejs", { planets }); // render the index template with planets data
  } catch (error) {
    console.log("Error fetching planets from database:", error);
    res.send("An error occurred when trying to load planets.");
  }
});

// N. = New = GET /planets/new - Show form to create a new planet
app.get("/planets/new", (req, res) => {
  res.render("new.ejs"); // render the form to add a new planet
});

// D. = Delete = DELETE /planets/:id - Delete a specific planet by ID
app.delete("/planets/:id", async (req, res) => {
  try {
    await Planet.findByIdAndDelete(req.params.id); // delete planet from database by ID
    res.redirect("/planets"); // redirect to the list of planets
  } catch (error) {
    console.log("Error deleting planet from database:", error);
    res.send("An error occurred when trying to delete the planet.");
  }
});

// U. = Update = PUT /planets/:id - Update a specific planet by ID
app.put("/planets/:id", async (req, res) => {
  try {
    await Planet.findByIdAndUpdate(req.params.id, req.body); // update planet in database by ID
    res.redirect("/planets"); // redirect to the list of planets
  } catch (error) {
    console.log("Error updating planet in database:", error);
    res.send("An error occurred when trying to update the planet.");
  }
});

// C. = Create = POST /planets - Create a new planet and redirect to index
app.post("/planets", async (req, res) => {
  try {
    await Planet.create(req.body); // create a new planet in the database
    res.redirect("/planets");
  } catch (error) {
    console.log("Error creating planet:", error);
    res.send("An error occurred when trying to create a planet.");
  }
});

// E. = Edit = GET /planets/:id/edit - Show edit form for a planet
app.get("/planets/:id/edit", async (req, res) => {
  try {
    const planet = await Planet.findById(req.params.id); // fetch planet from database by ID for editing
    res.render("edit.ejs", { planet }); // render the edit form with the planet data
  } catch (error) {
    console.log("Error fetching planet from database:", error);
    res.send("An error occurred when trying to load the planet.");
  }
});

// S. = Show = GET /planets/:id - Show a specific planet by ID
app.get("/planets/:id", async (req, res) => {
  try {
    const planet = await Planet.findById(req.params.id); // fetch planet from database by ID for viewing
    res.render("show.ejs", { planet }); // render the show template with the planet data
  } catch (error) {
    console.log("Error fetching planet from database:", error);
    res.send("An error occurred when trying to load the planet.");
  }
});

// Port Listener - One of 3 ways to use the port variable
app.listen(3000, () => {
  console.log("Listening on port, 3000");
});
