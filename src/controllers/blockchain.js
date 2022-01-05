const Blockchain = require("../../blockchain");
const { v1: uuidv1 } = require("uuid");

const nodeAddress = uuidv1().split("-").join("");
const testcoin = new Blockchain();

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

// @desc Create new block
// @route GET /api/v1/mine
// @access Public
exports.createNewBlock = (req, res) => {
  const lastBlock = testcoin.getLastBlock();
  const prevBlockHash = lastBlock["hash"];
  const currBlockData = {
    transaction: testcoin.pendingTransactions,
    index: lastBlock["index"]
  };

  const nonce = testcoin.proofOfWork(prevBlockHash, currBlockData);
  const blockHash = testcoin.hashBlock(prevBlockHash, currBlockData, nonce);
  const newBlock = testcoin.createNewBlock(nonce, prevBlockHash, blockHash);

  testcoin.createNewTransaction(12.5, "00", nodeAddress);

  res.json({ note: "New block mined successfully", block: newBlock });
};
