const express = require("express");
const { getBlockByHash } = require("../controllers/blockchain");

const router = express.Router();

router.route("/:blockHash").get(getBlockByHash);

module.exports = router;
