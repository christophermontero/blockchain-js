const express = require("express");
const { getBlockchain } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").get(getBlockchain);

module.exports = router;
