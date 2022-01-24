const express = require("express");
const { blockExplorer } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").get(blockExplorer);

module.exports = router;
