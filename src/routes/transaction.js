const express = require("express");
const { createTransaction } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").post(createTransaction);

module.exports = router;
