const Blockchain = require("../../blockchain");

const testcoin = new Blockchain();

// @desc Greeting
// @route GET /api/v1/blockchain
// @access Public
exports.greeting = (req, res) => {
  res.send("Hello blockchain");
};

// @desc Get entire blockchain
// @route GET /api/v1/blockchain
// @access Public
exports.getBlockchain = (req, res) => {
  res.send(testcoin);
};

// @desc Create new transaction in the Blockchain
// @route POST /api/v1/transaction
// @access Public
exports.createTransaction = (req, res) => {
  const blockIndex = testcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );

  res.json({ note: `Transaction will be added in block ${blockIndex}` });
};
