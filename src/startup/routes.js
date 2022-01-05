const express = require("express");
const path = require("path");

// Routes
const blockchain = require("./src/routes/blockchain");
const transaction = require("./src/routes/transaction");
const mine = require("./src/routes/mine");

module.exports = function (app) {
  // Mount routes
  app.use(express.static(path.join(__dirname, "src/public")));
  app.use("/api/v1/blockchain", blockchain);
  app.use("/api/v1/transaction", transaction);
  app.use("/api/v1/mine", mine);
};
