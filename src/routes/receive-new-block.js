const express = require("express");
const { receiveNewBlock } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").post(receiveNewBlock);

module.exports = router;
