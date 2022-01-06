const express = require("express");

// Routes
const blockchain = require("../routes/blockchain");
const transaction = require("../routes/transaction");
const mine = require("../routes/mine");

module.exports = function (app) {
  // Mount routes
  app.use(express.static("src/public"));
  app.use("/api/v1/blockchain", blockchain);
  app.use("/api/v1/transaction", transaction);
  app.use("/api/v1/mine", mine);
};
