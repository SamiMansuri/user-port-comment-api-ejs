const { Joi } = require("express-validation");

exports.loginValidation = {
  body: Joi.object({
    email: Joi.string()
      .email({
        tlds: { allow: ["com", "in"] },
      })
      .required(),
    password: Joi.string().min(6).required(),
  }),
};

exports.getUserByIdValidate = {
  params: Joi.object({
    userId: Joi.string()
      .hex()
      .length(24)
      .rule({ message: "userId is not a valid url" }),
  }),
};
