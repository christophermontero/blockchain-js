const express = require("express");
const { createNewBlock } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").get(createNewBlock);

module.exports = router;
