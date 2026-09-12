// ======================
// Required Packages
// ======================
require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");

const session = require("express-session");
const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");

// ======================
// Models
// ======================
const User = require("./models/User");

// ======================
// Routers
// ======================
const userRouter = require("./routes/user");
const resumeRouter = require("./routes/resume.js");

// ======================
// Express App
// ======================
const app = express();
const port = 8000;

// ======================
// MongoDB Connection
// ======================
main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/airesume");
}

// ======================
// Session Configuration
// ======================
const sessionOptions = {
    secret: "mysecretcode",
    resave: false,
    saveUninitialized: false,
};

// ======================
// View Engine
// ======================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ======================
// Middleware
// ======================
app.use(express.urlencoded({ extended: true }));

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// ======================
// Passport Configuration
// ======================
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

// ======================
// Routes
// ======================
app.use("/", userRouter);
app.use("/resume", resumeRouter);
// ======================
// Start Server
// ======================
app.listen(port, () => {
    console.log("Server Started");
});