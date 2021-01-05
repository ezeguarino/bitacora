const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isLoggedin, isNotLoggedin } = require("../lib/auth");

router.get("/signup", isNotLoggedin, (req, res) => {
  res.render("auth/signup");
});

router.post(
  "/signup",
  isNotLoggedin,
  passport.authenticate("local.signup", {
    successRedirect: "/profile",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/signin", (req, res) => {
  res.render("auth/signin");
});

router.post("/signin", (req, res, next) => {
  passport.authenticate("local.signin", {
    successRedirect: "/profile",
    failureRedirect: "/signin",
    failureFlash: true,
  })(req, res, next);
});

router.get("/profile", isLoggedin, (req, res) => {
  res.render("profile");
});

router.get("/logout", isLoggedin, (req, res) => {
  req.logOut();
  res.redirect("/signin");
});

module.exports = router;
