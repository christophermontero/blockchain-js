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
  const { transactionId, amount, sender, recipient } =
    testcoin.createNewTransaction(
      req.body.amount,
      req.body.sender,
      req.body.recipient
    );

  testcoin.addToPendingTrans({ transactionId, amount, sender, recipient });

  const createTransPromises = [];
  testcoin.networkNodes.forEach((networkNodeUrl) => {
    const createTransOpt = {
      method: "post",
      url: networkNodeUrl + "/api/v1/transaction",
      data: { transactionId, amount, sender, recipient },
      headers: { "Content-Type": "application/json" }
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
      return res.status(error.response.status).send(error.response.data);
    });
};

// @desc Create new block
// @route GET /api/v1/mine
// @access Public
exports.createNewBlock = (req, res) => {
  const lastBlock = testcoin.getLastBlock();
  const prevBlockHash = lastBlock["hash"];
  const currBlockData = {
    transactions: testcoin.pendingTransactions,
    index: lastBlock["index"] + 1
  };

  const nonce = testcoin.proofOfWork(prevBlockHash, currBlockData);
  const blockHash = testcoin.hashBlock(prevBlockHash, currBlockData, nonce);

  const newBlock = testcoin.createNewBlock(nonce, prevBlockHash, blockHash);

  const mineBlocksPromises = [];
  testcoin.networkNodes.forEach((networkNodeUrl) => {
    const mineBlockOpt = {
      method: "post",
      url: networkNodeUrl + "/api/v1/receive-new-block",
      data: { newBlock },
      headers: { "Content-Type": "application/json" }
    };

    mineBlocksPromises.push(axios(mineBlockOpt));
  });

  Promise.all(mineBlocksPromises)
    .then((response) => {
      const transOpt = {
        method: "post",
        url: testcoin.currentNodeUrl + "/api/v1/transaction/broadcast",
        data: { amount: 12.5, sender: "00", recipient: nodeAddress },
        headers: { "Content-Type": "application/json" }
      };

      return axios(transOpt);
    })
    .then((response) => {
      return res.json({
        note: "New block mined successfully",
        block: newBlock
      });
    })
    .catch((error) => {
      return res.status(error.response.status).send(error.response.data);
    });
};

// @desc Receive a new block and broadcast it the network
// @route POST /api/v1/receive-new-block
// @access Public
exports.receiveNewBlock = (req, res) => {
  const newBlock = req.body.newBlock;
  const lastBlock = testcoin.getLastBlock();

  if (
    lastBlock.hash !== newBlock.prevBlockHash ||
    lastBlock["index"] + 1 !== newBlock["index"]
  ) {
    return res.status(400).json({ note: "New block rejected", newBlock });
  } else {
    testcoin.chain.push(newBlock);
    testcoin.pendingTransactions = [];

    return res.json({ note: "New block received and accepted", newBlock });
  }
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
      headers: { "Content-Type": "application/json" }
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

      axios(registerBulkOpt);

      testcoin.networkNodes.push(newNodeUrl);
    })
    .then((response) => {
      return res.json({
        note: "New node registered with network successfully"
      });
    })
    .catch((error) => {
      return res.status(error.response.status).send(error.response.data);
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
