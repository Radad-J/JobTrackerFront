const handleErrors = (err) => {
  let errors = {};

  if (err["cloudinaryError"]) {
    return err["cloudinaryError"];
  }

  if (err.message == "jwt must be provided") {
    errors.authentification = "Not authentifed";
  }

  if (err.code == 11000) {
    errors.email = "This email already registered";
  }

  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  if (
    err.message.includes("user validation failed:") ||
    err.message.includes("job validation failed:") ||
    err.message.includes("Validation failed:")
  ) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const multer = require("multer");

const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res
        .status(400)
        .json({ fileFieldError: "Unexpected file field in request" });
    }
    // Gérer d'autres erreurs multer si nécessaire
  }
  // Passer à la gestion des erreurs suivante si ce n'est pas une erreur multer
  next(err);
};

module.exports = { handleErrors, handleMulterErrors };
