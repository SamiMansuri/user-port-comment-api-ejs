const express = require("express");
const { Router } = express;
const {
  addPost,
  addPostProcess,
  updatePostProcess,
  updatePost,
  deletePost,
} = require("../controllers/posts.controller");
const {
  addPostValidation,
  deletePostValidate,
  getPostByIdValidate,
  updatePostValidation,
} = require("../validations/post.validation");
const { validate } = require("express-validation");
const {
  authorization,
  checkAuthenticated,
} = require("../middlewares/auth.middleware");

const postRouter = Router({ mergeParams: true });

postRouter.get("/", checkAuthenticated, addPost);
postRouter.post("/", validate(addPostValidation), addPostProcess);
postRouter.get("/:postId", validate(getPostByIdValidate), updatePost);
postRouter.put("/:postId", validate(updatePostValidation), updatePostProcess);
postRouter.delete(
  "/:postId",
  validate(deletePostValidate),
  authorization(["admin", "user"]),
  deletePost
);

exports.PostRouter = postRouter;
