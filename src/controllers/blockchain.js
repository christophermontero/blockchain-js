const Blockchain = require("../../blockchain");
const { v1: uuidv1 } = require("uuid");
const axios = require("axios");

const nodeAddress = uuidv1().split("-").join("");
const testcoin = new Blockchain();

// @desc Get entire blockchain
// @route GET /api/v1/blockchain
// @access Public
exports.getBlockchain = (req, res) => {
  return res.send(testcoin);
};

// @desc Create new transaction in the Blockchain
// @route POST /api/v1/transaction
// @access Public
exports.createTransaction = (req, res) => {
  const newTransaction = req.body;
  const blockIndex = testcoin.addToPendingTrans(newTransaction);

  return res.json({ note: `Transaction will added in block ${blockIndex}` });
};

// @desc Register a new transaction and broadcast it the network
// @route POST /api/v1/transaction/broadcast
// @access Public
exports.createAndBroadcastTrans = (req, res) => {
  const newTransaction = testcoin.createNewTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );

  testcoin.addToPendingTrans(newTransaction);

  const createTransPromises = [];
  testcoin.networkNodes.forEach((networkNodeUrl) => {
    const createTransOpt = {
      method: "post",
      url: networkNodeUrl + "/api/v1/transaction",
      data: { newTransaction },
      headers: { "content-type": "application/json" }
    };

    createTransPromises.push(axios(createTransOpt));
  });

  Promise.all(createTransPromises)
    .then((response) => {
      return res.json({
        note: "Transaction created and broadcast successfully"
      });
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
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

  return res.json({ note: "New block mined successfully", block: newBlock });
};

// @desc Register a new node and broadcast it the network
// @route POST /api/v1/register-broadcast-node
// @access Public
exports.registerAndBroadcastNode = (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;

  if (testcoin.networkNodes == 0)
    return res
      .status(400)
      .json({ note: "Must be at least one node registered" });

  const registerNodesPromises = [];
  testcoin.networkNodes.forEach((networkNodeUrl) => {
    const registerNodeOpt = {
      method: "post",
      url: networkNodeUrl + "/api/v1/register-node",
      data: { newNodeUrl },
      headers: { "content-type": "application/json" }
    };

    registerNodesPromises.push(axios(registerNodeOpt));
  });

  Promise.all(registerNodesPromises)
    .then((response) => {
      const registerBulkOpt = {
        method: "post",
        url: newNodeUrl + "/api/v1/register-nodes-bulk",
        data: {
          allNetworkNodes: [...testcoin.networkNodes, testcoin.currentNodeUrl]
        },
        headers: { "Content-Type": "application/json" }
      };

      axios(registerBulkOpt).then((response) => {
        return res.json({
          note: "New node registered with network successfully"
        });
      });

      testcoin.networkNodes.push(newNodeUrl);
    })
    .catch((error) => {
      return res.status(400).send(error);
    });
};

// @desc Register a node
// @route POST /api/v1/register-node
// @access Public
exports.registerNode = (req, res) => {
  const newNodeUrl = req.body.newNodeUrl;

  if (
    testcoin.networkNodes.indexOf(newNodeUrl) !== -1 ||
    testcoin.currentNodeUrl == newNodeUrl
  ) {
    return res.status(400).send({ note: "Node already exists" });
  }

  testcoin.networkNodes.push(newNodeUrl);
  return res.json({ note: "New node register successfully" });
};

// @desc Register multiple nodes at once
// @route POST /api/v1/register-nodes-bulk
// @access Public
exports.registerNodesBulk = (req, res) => {
  const allNetworkNodes = req.body.allNetworkNodes;
  let nodeAlreadyPresent = false;

  allNetworkNodes.forEach((networkNodeUrl) => {
    if (
      testcoin.networkNodes.indexOf(networkNodeUrl) !== -1 ||
      testcoin.currentNodeUrl == networkNodeUrl
    ) {
      nodeAlreadyPresent = true;
    } else {
      testcoin.networkNodes.push(networkNodeUrl);
    }
  });

  if (nodeAlreadyPresent)
    return res.status(400).json({ note: "Node already exists" });

  return res.send({ note: "Bulk registration successfully" });
};
