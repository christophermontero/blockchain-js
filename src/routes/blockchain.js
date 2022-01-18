const express = require("express");
const { getBlockchain, getBlockByHash } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").get(getBlockchain);
router.route("/:blockHash").get(getBlockByHash);

module.exports = router;
