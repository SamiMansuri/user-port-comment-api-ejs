const { Joi } = require("express-validation");

exports.addPostValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
  }),
  params: Joi.object({
    userId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "userId is not a valid url" }),
  }),
};

exports.updatePostValidation = {
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string(),
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

exports.getPostByIdValidate = {
  params: Joi.object({
    postId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "userId or postId is not a valid url" }),
    userId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "userId or postId is not a valid url" }),
  }),
};

exports.deletePostValidate = {
  params: Joi.object({
    userId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "userId or postId is not a valid url" }),
    postId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "userId or postId is not a valid url" }),
  }),
};
