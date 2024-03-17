const express = require("express");
const { Router } = express;
const passport = require("passport");
const {
  register,
  registerProcess,
  deleteUserProcess,
  getUserById,
  getAllUsers,
  updateUserProcess,
  resetPassword,
  setPassword,
  loginUser,
  loginUserProcess,
  sendMail,
  logout,
  updateProfile,
  forgotPassword,
} = require("../controllers/users.controller");
const { getUserByIdValidate } = require("../validations/user.validation");
const { validate } = require("express-validation");
const {
  authorization,
  checkAuthenticated,
  checkLoggedIn,
} = require("../middlewares/auth.middleware");

const userRouter = Router({ mergeParams: true });

userRouter.get("/login", checkLoggedIn, loginUser);
userRouter.get("/signIn", checkLoggedIn, register);
userRouter.get("/logout", logout);
userRouter.get("/forgotPassword", forgotPassword);
userRouter.get("/reset-confirm/:resetLink", resetPassword);

userRouter.get(
  "/",
  checkAuthenticated,
  authorization(["admin", "user"]),
  getAllUsers
);
userRouter.get(
  "/:userId",
  validate(getUserByIdValidate),
  checkAuthenticated,
  getUserById
);
userRouter.get("/:userId/updateProfile", checkAuthenticated, updateProfile);

userRouter.post("/signIn", registerProcess);
userRouter.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/users/login",
    failureFlash: "Enter correct Email, Password",
  }),
  loginUserProcess
);
userRouter.post("/sendMail", sendMail);
userRouter.post("/setPassword/:token", setPassword);

userRouter.put(
  "/:userId",
  checkAuthenticated,
  authorization(["user", "admin"]),
  updateUserProcess
);

userRouter.delete(
  "/:userId",
  checkAuthenticated,
  authorization(["admin", "user"]),
  deleteUserProcess
);

exports.UserRouter = userRouter;
