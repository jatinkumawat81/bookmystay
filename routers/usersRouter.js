const express = require('express');
const userRouter = express.Router();
const userController = require("../controller/userController");
const authController = require('../controller/authController');

userRouter.route("/updatePassword").patch(authController.isAuthenticated, userController.updatePassword);
userRouter.route("/updateMe").patch(authController.isAuthenticated, userController.updateMe);
userRouter.route("/deleteMe").delete(authController.isAuthenticated, userController.deleteMe);

module.exports = userRouter;