import { Router } from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { generateJWTToken } from "../services/token.js";
import homePage from "../middleware/home-page.js";

const router = Router();

// Login
router.get("/login", homePage, (req, res) => {
  res.render("login", {
    title: "Login",
    isLogin: true,
    loginError: req.flash("loginError"),
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    req.flash("loginError", "All fields are required");
    res.redirect("/login");
    return;
  }

  const existUser = await User.findOne({ email });
  if (!existUser) {
    req.flash("loginError", "User not found");
    res.redirect("/login");
    return;
  }

  const isPassEqual = await bcrypt.compare(password, existUser.password);
  if (!isPassEqual) {
    req.flash("loginError", "Password wrong");
    res.redirect("/login");
    return;
  }

  const token = generateJWTToken(existUser._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.redirect("/");
});

// Register
router.get("/register", homePage, (req, res) => {
  res.render("register", {
    title: "Register",
    isRegister: true,
    registerError: req.flash("registerError"),
  });
});

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if ((!firstname || !lastname) && (email || password)) {
    req.flash("registerError", "Firstname and Lastname are reqired");
    res.redirect("/register");
    return;
  }

  if (!firstname || !lastname || !email || !password) {
    req.flash("registerError", "All fields are required");
    res.redirect("/register");
    return;
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    req.flash("registerError", "User has already registered");
    res.redirect("/register");
    return;
  }

  if (password.length < 8) {
    req.flash("registerError", "Password must have been 8 characters at least");
    res.redirect("/register");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userData = {
    firstname,
    lastname,
    email,
    password: hashedPassword,
  };

  const user = await User.create(userData);
  const token = generateJWTToken(user._id);
  res.cookie("token", token, { httpOnly: true, secure: true });
  res.redirect("/");
});

// Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

export default router;
