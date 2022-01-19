const express = require("express");
const { getAddress } = require("../controllers/blockchain");

const router = express.Router();

router.route("/:address").get(getAddress);

module.exports = router;
