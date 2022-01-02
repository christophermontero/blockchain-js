const express = require("express");
const { greeting } = require("../controllers/mine");

const router = express.Router();

router.route("/").get(greeting);

module.exports = router;
