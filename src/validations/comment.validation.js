const { Joi } = require("express-validation");

exports.addCommentValidation = {
  body: Joi.object({
    comment: Joi.string().required(),
  }),
  params: Joi.object({
    userId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "userId is not a valid url" }),
    postId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "postId is not a valid url" }),
  }),
};

exports.deleteCommentValidation = {
  params: Joi.object({
    userId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "userId is not a valid url" }),
    postId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "postId is not a valid url" }),
    commentId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "commentId is not a valid url" }),
  }),
};
