const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
router.get("/", (req, res) => {
    res.render("home/index");
});
router.get("/signup", (req, res) => {
    res.render("users/signup");
});
router.post("/signup", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const newUser = new User({
            username,
            email
        });

        await User.register(newUser, password);

        res.redirect("/login");

    } catch (err) {

        console.log(err);
        res.send(err);

    }

});

router.get("/login", (req, res) => {
    res.render("users/login");
});
router.post("/login",
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome Back");
        res.redirect("/resume/upload");
    }
);
module.exports = router;