const express = require("express");
const app = express();
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const PORT = 4070;


// Database connection
mongoose.connect("mongodb://localhost:27017/expenseTracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Error connecting to MongoDB:', err));




// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "group g6",
    resave: false,
    saveUninitialized: true,
}));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (!req.session.isAuth) {
        return res.redirect("/login");
    }
    next();
}

// Routes
app.get("/", isAuthenticated, (req, res) => {
    res.redirect("/profile");
});

app.get("/profile", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "public/profile.html")); // Serve the static HTML profile page
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public/register.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public/login.html"));
});

app.post("/register", (req, res) => {
    let { email, password } = req.body;

    // Debugging logs
    console.log("Registering user:", email, password);

    // For demonstration purposes only; in a real app, use hashed passwords
    req.session.email = email;
    req.session.password = password;
    res.redirect("/login");
});

app.post("/login", (req, res) => {
    let { email, password } = req.body;

    // Debugging logs
    console.log("Login attempt with:", email, password);
    console.log("Stored credentials:", req.session.email, req.session.password);

    // Check user credentials
    if (email === req.session.email && password === req.session.password) {
        req.session.isAuth = true;

        // Debugging log
        console.log("Login successful, redirecting to profile...");
        
        return res.redirect("/profile");
    }

    // Redirect to login if authentication fails
    console.log("Authentication failed, redirecting to login...");
    res.redirect("/login");
});

app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect("/login");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
