const express = require("express");
const path = require("path");

// Routes
const blockchain = require("../routes/blockchain");
const transaction = require("../routes/transaction");
const mine = require("../routes/mine");

module.exports = function (app) {
  // Mount routes
  console.log(path.join(__dirname, "../public"));
  app.use(express.static(path.join(__dirname, "src/public")));
  app.use("/api/v1/blockchain", blockchain);
  app.use("/api/v1/transaction", transaction);
  app.use("/api/v1/mine", mine);
};
