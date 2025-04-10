const express = require("express");
const fs = require("fs");
const path = require("path"); // To use path.join for file paths
const app = express();
const PORT = 3000;

const usersFile = "./users.json"; // File to store user data

// Middleware to serve HTML files and handle form data
app.use(express.static("public")); // Serves files from "public" folder
app.use(express.urlencoded({ extended: true })); // For form data
app.use(express.json()); // For JSON data from frontend/JavaScript

// Route for home page (login form)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
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
    //return res.status(400).send("Username already exists.");
    return res.sendFile(path.join(__dirname, "public", "failed.html"));
  }

  // Add new user
  users.push({ username, password });

  // Save updated user list to file
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));

  // Serve the success page
  res.sendFile(path.join(__dirname, "public", "success.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
