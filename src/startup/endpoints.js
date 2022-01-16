const express = require("express");

// Routes
const blockchain = require("../routes/blockchain");
const transaction = require("../routes/transaction");
const mine = require("../routes/mine");
const registerAndBroadcastNode = require("../routes/register-broadcast-node");
const registerNode = require("../routes/register-node");
const registerNodesBulk = require("../routes/register-nodes-bulk");
const receiveNewBlock = require("../routes/receive-new-block");
const consensus = require("../routes/consensus");

module.exports = function (app) {
  // Mount routes
  app.use(express.static("src/public"));
  app.use("/api/v1/blockchain", blockchain);
  app.use("/api/v1/transaction", transaction);
  app.use("/api/v1/mine", mine);
  app.use("/api/v1/register-node", registerNode);
  app.use("/api/v1/register-broadcast-node", registerAndBroadcastNode);
  app.use("/api/v1/register-nodes-bulk", registerNodesBulk);
  app.use("/api/v1/receive-new-block", receiveNewBlock);
  app.use("/api/v1/consensus", consensus);
};
