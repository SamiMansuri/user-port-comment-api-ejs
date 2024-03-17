const { ValidationError } = require("express-validation");

exports.errorHandler = (err, req, res, next) => {
  const { status = 500 } = err;
  const errorMessage = err.message || "Something went wrong.";
  return res.render("errorPage", { statusCode: status, errorMessage });
};

exports.notFoundHandler = (req, res, next) => {
  return res.render("pageNotFound");
};

exports.validationError = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    let errorMessage;
    if (err.details.query) {
      errorMessage = err.details.query[0].message;
    }
    if (err.details.params) {
      errorMessage = err.details.params[0].message;
    }
    if (err.details.body) {
      errorMessage = err.details.body[0].message;
    }
    const statusCode = err.statusCode;
    return res.render("errorPage", { statusCode, errorMessage });
  }
  next(err);
};
