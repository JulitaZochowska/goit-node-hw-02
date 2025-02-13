const express = require("express");
const usersController = require("./user.controller");
const {
  userValidatorMiddleware,
  emailInBodyValidatorMiddleware,
} = require("./user.validators");
const { authMiddleware } = require("../auth/auth.middleware");
const multer = require("multer");
const path = require("path");
const appDir = path.dirname(require.main.filename);

// Middleware do "rozpakowania" typu form-data z plikami (tzw. multipart/form-data)
const uploadAvatarMiddleware = multer({
  dest: path.join(appDir, "tmp"),
  limits: {
    fieldSize: 1048576,
  },
}).single("avatar");

const usersRouter = express.Router();

usersRouter.post(
  "/signup",
  userValidatorMiddleware,
  usersController.signupHandler
);
usersRouter.post(
  "/login",
  userValidatorMiddleware,
  usersController.loginHandler
);
usersRouter.get("/logout", authMiddleware, usersController.logoutHandler);
usersRouter.get("/current", authMiddleware, usersController.currentHandler);
usersRouter.patch(
  "/avatars",
  authMiddleware,
  uploadAvatarMiddleware,
  usersController.avatarsHandler
);
usersRouter.get("/verify/:verificationToken", usersController.verifyHandler);
usersRouter.post(
  "/verify",
  emailInBodyValidatorMiddleware,
  usersController.resendVerificationHandler
);

module.exports = usersRouter;
