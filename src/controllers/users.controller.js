const createError = require("http-errors");
const { Joi } = require("express-validation");
const { userModel } = require("../models/users.model");
const { postModel } = require("../models/posts.model");
const { commentModel } = require("../models/comments.model");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { passwordReset } = require("../models/passwordReset.model");
require("dotenv").config();

const loginUser = async (req, res, next) => {
  res.render("login", {
    message: req.flash("error"),
    filledData: { email: "" },
  });
};

const loginUserProcess = async (req, res, next) => {
  try {
    res.redirect("/feed");
  } catch (error) {
    req.flash("message", "Enter correct credentials");
    return res.redirect("users/login");
  }
};

const register = async (req, res, next) => {
  res.render("register", {
    filledData: {
      name: "",
      email: "",
      username: "",
    },
    error: "",
  });
};

const registerProcess = async (req, res, next) => {
  const { name = "", email = "", username = "", password = "" } = req.body;
  try {
    const addUserValidation = Joi.object({
      name: Joi.string().required(),
      username: Joi.string().min(4).max(30).required(),
      email: Joi.string()
        .email({
          tlds: { allow: ["com", "in"] },
        })
        .required(),
      password: Joi.string().min(6).required(),
    });
    const validate = addUserValidation.validate(req.body);

    if (name && email && username && password) {
      if (validate.error) {
        res.render("register", {
          error: validate.error.details[0].message,
          filledData: {
            name,
            email,
            username,
          },
        });
      }

      const user = await userModel.findOne({ email: email });
      if (!user) {
        await userModel.create({ name, username, email, password });
        return res.redirect("/users/login");
      } else {
        return res.render("register", {
          error: "Email is in use!!",
          filledData: {
            name,
            email,
            username,
          },
        });
      }
    } else {
      res.render("register", {
        error: "Please Enter All The Fields!!",
        filledData: {
          name,
          email,
          username,
        },
      });
    }
  } catch (error) {
    res.render("register", {
      error: error.message,
      filledData: {
        name,
        email,
        username,
      },
    });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const recordsToSkip = page > 0 ? limit * (page - 1) : 0;
    const allUsers = await userModel
      .find({ isDeleted: false }, { isDeleted: 0, deletedAt: 0, password: 0 })
      .skip(recordsToSkip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
    if (allUsers.length === 0) {
      throw createError(404, "Page not found");
    }
    const noOfDocs = await userModel.countDocuments();
    const pages = Math.ceil(noOfDocs / limit);
    res.render("users", { users: allUsers, loggedUser: req.user, pages });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await userModel
      .findOne(
        { _id: userId, isDeleted: false },
        { email: 1, name: 1, username: 1 }
      )
      .lean();
    const userPosts = await postModel
      .find({ userId: userId }, { title: 1, description: 1 })
      .populate("userId")
      .lean();
    const postIds = userPosts.map((post) => post._id);
    const commentsOfPosts = await commentModel
      .find({ commentOn: postIds })
      .populate("commentBy");
    res.render("userProfile", {
      user: req.user,
      userById: user,
      userPosts,
      commentsOfPosts,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserProcess = async (req, res, next) => {
  try {
    const payload = req.body;
    const { userId } = req.params;
    const { _id: tokenUserId } = req.user;
    if (userId !== tokenUserId.toString())
      throw createError(403, "Unauthorized");

    let user = await userModel.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      { ...payload }
    );
    if (!user) throw createError(404, "User does not exist");
    return res.redirect(`/users/${tokenUserId.toString()}`);
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    res.render("updateUserProfile", {
      user: req.user,
      filledData: {
        name: "",
        email: "",
        username: "",
      },
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

const deleteUserProcess = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { _id: tokenUserId, role } = req.user;
    if (userId !== tokenUserId.toString() && role !== "admin")
      throw createError(403, "Unauthorized");
    const postsIds = await postModel.find({ userId }, "_id").lean();
    await Promise.all([
      commentModel.updateMany(
        {
          $or: [
            { commentOn: { $in: postsIds.map((id) => id) } },
            { commentBy: userId },
          ],
        },
        { $set: { isDeleted: true, deletedAt: Date.now() } }
      ),

      postModel.updateMany(
        { userId },
        { isDeleted: true, deletedAt: Date.now() }
      ),

      userModel.findByIdAndUpdate(userId, {
        isDeleted: true,
        deletedAt: Date.now(),
      }),
    ]);
    return role === "admin"
      ? res.redirect("/users")
      : res.redirect("/users/login");
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  res.clearCookie("connect.sid");
  req.logOut((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      res.redirect("login");
    });
  });
};

const forgotPassword = async (req, res, next) => {
  try {
    res.render("forgotPasswordPage", {
      message: "",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const isTokenExist = await passwordReset.find({
      token: req.params.resetLink,
    });
    if (isTokenExist.length)
      return res.render("resetPasswordPage", {
        error: "",
        token: req.params.resetLink,
      });
    return res.send("Reset password link is expired");
  } catch (error) {
    next(error);
  }
};

const sendMail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const token = (await bcrypt.hash(email, salt)).replace(/\//g, "");
    const resetLink = `http://localhost:3000/users/reset-confirm/${token}`;

    const user = await userModel.findOne({ email: email });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sachin142322@gmail.com",
        pass: "gxqwljkxsklmqfxp",
      },
    });

    const mailOptions = {
      from: "sachin142322@gmail.com",
      to: email,
      subject: "Sending Email using Node.js",
      text: `Hi, here's your password reset link: ${resetLink}. If you did not request this link, ignore it.`,
    };

    await passwordReset.updateOne(
      { user: user._id },
      { user: user._id, token: token },
      { upsert: true }
    );

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return res.render("forgotPasswordPage", {
      message: "email send successfully",
    });
  } catch (error) {
    console.error(error);
    req.flash("error", "Failed to generate reset link, please try again");
    return res.redirect("back");
  }
};

const setPassword = async (req, res, next) => {
  try {
    const { password } = req.body;
    const { error } = Joi.object({
      password: Joi.string().min(6).required(),
      confirmPassword: Joi.ref("password"),
    }).validate(req.body);
    if (error) throw createError(400, error.details[0].message);

    const reset = await passwordReset.findOneAndDelete({
      token: req.params.token,
    });
    if (!reset) throw createError(404, "Invalid or expired token");

    const user = await userModel.findByIdAndUpdate(reset.user, { password });
    if (!user) throw createError(404, "User not found");

    return res.redirect("/users/login");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  registerProcess,
  deleteUserProcess,
  loginUser,
  loginUserProcess,
  logout,
  setPassword,
  resetPassword,
  sendMail,
  getUserById,
  getAllUsers,
  forgotPassword,
  updateUserProcess,
  updateProfile,
};
