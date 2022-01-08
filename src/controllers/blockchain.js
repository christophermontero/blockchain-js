const Blockchain = require("../../blockchain");
const { v1: uuidv1 } = require("uuid");
const axios = require("axios");

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

  testcoin.createNewTransaction(12.5, "00", nodeAddress);
  const newBlock = testcoin.createNewBlock(nonce, prevBlockHash, blockHash);

  res.json({ note: "New block mined successfully", block: newBlock });
};

// @desc Register a new node and broadcast it the network
// @route POST /api/v1/register-broadcast-node
// @access Public
exports.registerAndBroadcastNode = (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;

  if (testcoin.networkNodes.indexOf(newNodeUrl) == -1) {
    testcoin.networkNodes.push(newNodeUrl);
  }

  const registerNodesPromises = [];
  testcoin.networkNodes.forEach((networkNodeUrl) => {
    const registerOpt = {
      method: "post",
      url: networkNodeUrl + "/register-node",
      data: { newNodeUrl },
      headers: { "Content-Type": "application/json" }
    };

    registerNodesPromises.push(axios(registerOpt));
  });

  Promise.all(registerNodesPromises)
    .then((data) => {
      const bulkRegisterOpt = {
        method: "post",
        url: newNodeUrl + "/register-nodes-bulk",
        data: {
          allNetworkNodes: [...testcoin.networkNodes, testcoin.currentNodeUrl]
        },
        headers: { "Content-Type": "application/json" }
      };

      return axios(bulkRegisterOpt).then((response) => console.log(response));
    })
    .then((data) => {
      res.json({ note: "New node registered with network successfully" });
    });
};

// @desc Register a node
// @route POST /api/v1/register-node
// @access Public
exports.registerNode = (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;

  if (
    testcoin.networkNodes.indexOf(newNodeUrl) !== -1 &&
    testcoin.currentNodeUrl == newNodeUrl
  ) {
    res.status(400).json({ note: "Node already exists" });
  }

  testcoin.networkNodes.push(newNodeUrl);
  res.json({ note: "New node register successfully" });
};

// @desc Register multiple nodes at once
// @route POST /api/v1/register-multiple-bulk
// @access Public
exports.registerMultipleBulk = (req, res) => {};
