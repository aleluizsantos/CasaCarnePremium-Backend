const Yup = require("yup");

const errorHandler = (error, request, response, next) => {
  if (error instanceof Yup.ValidationError) {
    let errors = {};

    error.inner.forEach((err) => {
      errors[err.path] = err.errors;
    });

    return response.status(400).json({ message: "Validation fails", errors });
  }

  return response.status(500).json({ message: "Internal server error" });
};

module.exports = errorHandler;
