const express = require("express");
const { registerNodesBulk } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").post(registerNodesBulk);

module.exports = router;
