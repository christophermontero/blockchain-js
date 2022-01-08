const express = require("express");
const { registerMultipleBulk } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").post(registerMultipleBulk);

module.exports = router;
