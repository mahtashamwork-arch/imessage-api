/* eslint-disable prettier/prettier */
const express = require("express");

const router = express.Router();
const authController = require("../../../controllers/auth/auth.controller");

// Define routes
router.post("/login", authController.login);
router.get("/verify", authController.verify);


module.exports = router;
