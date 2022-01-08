const express = require("express");
const { registerAndBroadcastNode } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").post(registerAndBroadcastNode);

module.exports = router;
