const express = require("express");
const { registerNode } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").post(registerNode);

module.exports = router;
