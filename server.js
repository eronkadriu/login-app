const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

const usersFile = "./users.json"; // File to store user data

// Middleware to serve HTML files and handle form data
app.use(express.static("public")); // Serves files from "public" folder
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json()); // For JSON data from frontend/JavaScript

// Route for home page (optional, since public/index.html will be served automatically)
app.get("/", (req, res) => {
  res.send("Welcome to the registration page!");
});

// POST route to handle registration
app.post("/submit", (req, res) => {
  const { username, password } = req.body;

  // Log to terminal for debugging
  console.log("Received registration:", req.body);

  // Load existing users
  let users = [];
  if (fs.existsSync(usersFile)) {
    const data = fs.readFileSync(usersFile);
    users = JSON.parse(data);
  }

  // Check if username already exists
  const userExists = users.find(u => u.username === username);
  if (userExists) {
    return res.status(400).send("Username already exists.");
  }

  // Add new user
  users.push({ username, password });

  // Save updated user list to file
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  // Respond to client
  res.send("User registered successfully!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
