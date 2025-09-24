/* eslint-disable prettier/prettier */
const express = require("express");

const router = express.Router();
const testController = require("../../../controllers/test/test.controller");

// Define routes
router.get("/check", testController.test);


module.exports = router;
