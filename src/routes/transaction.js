const express = require("express");
const {
  createTransaction,
  createAndBroadcastTrans
} = require("../controllers/blockchain");
const validate = require("../middlewares/validate");
const { transactionSchema } = require("../middlewares/schemas");

const router = express.Router();

router.route("/").post(validate(transactionSchema), createTransaction);
router
  .route("/broadcast")
  .post(validate(transactionSchema), createAndBroadcastTrans);

module.exports = router;
