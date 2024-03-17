const { Router } = require("express");
const commentRouter = Router({ mergeParams: true });
const {
  addComment,
  deleteComment,
} = require("../controllers/comments.controller");
const {
  addCommentValidation,
  deleteCommentValidation,
} = require("../validations/comment.validation");
const { validate } = require("express-validation");
const {
  authorization,
  checkAuthenticated,
} = require("../middlewares/auth.middleware");

commentRouter.post(
  "/",
  validate(addCommentValidation),
  checkAuthenticated,
  addComment
);

commentRouter.delete(
  "/:commentId",
  validate(deleteCommentValidation),
  checkAuthenticated,
  authorization(["admin", "user"]),
  deleteComment
);

exports.CommentRouter = commentRouter;
