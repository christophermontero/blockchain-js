const express = require("express");
const { greeting } = require("../controllers/blockchain");

const router = express.Router();

router.route("/").get(greeting);

module.exports = router;
