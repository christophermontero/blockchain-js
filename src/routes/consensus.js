const express = require("express");
const { consensus } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").get(consensus);

module.exports = router;
