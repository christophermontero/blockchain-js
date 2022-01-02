const express = require("express");
const { greeting } = require("../controllers/transaction");

const router = express.Router();

router.route("/").get(greeting);

module.exports = router;
