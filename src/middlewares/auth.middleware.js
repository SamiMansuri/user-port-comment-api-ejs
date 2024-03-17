const { userModel } = require("../models/users.model");
const passport = require("passport");
const LocalStrategy = require("passport-local");
require("dotenv").config();

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function verify(email, password, cb) {
      try {
        const user = await userModel.findOne({
          email: email,
          isDeleted: false,
        });
        if (!user) {
          return cb(null, false, { message: "Incorrect username." });
        }
        const passwordCompare = await user.checkPassword(password);
        if (!passwordCompare) {
          return cb(null, false, { message: "Incorrect password." });
        }
        return cb(null, user);
      } catch (error) {
        cb(error);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  const user = await userModel.findOne(
    { _id: id, isDeleted: false },
    { isDeleted: 0, deletedAt: 0, password: 0 }
  );
  cb(null, user);
});

exports.checkAuthenticated = (req, res, next) => {
  try {
    if (req.isAuthenticated()) return next();
    res.redirect("/users/login");
  } catch (error) {
    next(error);
  }
};

exports.checkLoggedIn = (req, res, next) => {
  try {
    if (req.isAuthenticated()) res.redirect("/feed");
    next();
  } catch (error) {
    next(error);
  }
};

exports.authorization = (roles) => {
  return async (req, res, next) => {
    try {
      const { role, _id } = req.user;
      if (roles.includes(role)) {
        return next();
      }
      return res.render("pageNotFound");
    } catch (error) {
      return next(error);
    }
  };
};
