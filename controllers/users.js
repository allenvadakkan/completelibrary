const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/User");

module.exports = {
  signUpPage: (req, res) => {
    res.render("signup");
  },

  postSignUp: (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
      errors.push({ msg: "Please enter all fields" });
    }

    if (password != password2) {
      errors.push({ msg: "Passwords do not match" });
    }

    if (password.length < 8) {
      errors.push({ msg: "Password must be at least 8 characters" });
    }

    if (errors.length > 0) {
      res.render("signup", {
        errors,
        name,
        email,
        password,
        password2,
      });
    } else {
      User.findOne({ email: email }).then((user) => {
        if (user) {
          errors.push({ msg: "Email already exists" });
          res.render("signup", {
            errors,
            name,
            email,
            password,
            password2,
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "Account created successfully, Please login to continue!"
                  );
                  res.redirect("/users/login");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      });
    }
  },

  loginPage: (req, res) => {
    res.render("login");
  },

  postLoginPage: (req, res, next) => {
    passport.authenticate("local", {
      successRedirect: ("/home"),
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  },

  logOut: (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  },

  deleteUser: (req, res) => {
    User.findByIdAndRemove({ _id: req.params.id })
      .then(() => {
        res.redirect("/");
      })
      .catch((error) => {
        res.status(400).json({
          error: error,
        });
      });
  }
};
