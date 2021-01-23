const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

const {
  signUpPage,
  postSignUp,
  loginPage,
  postLoginPage,
  logOut,
  deleteUser,
} = require("../controllers/users");

// User Routes

router.get("/signup", signUpPage);

router.post("/signup", postSignUp);

router.get("/login", loginPage);

router.post("/login", postLoginPage);

router.get("/logout", ensureAuthenticated, logOut);

router.delete("/delete/:id", ensureAuthenticated, deleteUser);

module.exports = router;
