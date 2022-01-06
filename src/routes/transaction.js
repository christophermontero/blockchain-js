const express = require("express");
const { createTransaction } = require("../controllers/blockchain");
const validate = require("../middlewares/validate");
const { transactionSchema } = require("../middlewares/schemas");

const router = express.Router();

router.route("/").post(validate(transactionSchema), createTransaction);

module.exports = router;
