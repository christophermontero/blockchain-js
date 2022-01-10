const sha256 = require("sha256");
const currentNodeUrl = process.argv[3];
const { v1: uuidv1 } = require("uuid");

function Blockchain() {
  this.chain = [];
  this.pendingTransactions = [];
  this.currentNodeUrl = currentNodeUrl;
  this.networkNodes = [];

  this.createNewBlock(0, "0", "0");
}

Blockchain.prototype.createNewBlock = function (nonce, prevBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.pendingTransactions,
    nonce,
    hash,
    prevBlockHash
  };

  this.pendingTransactions = [];
  this.chain.push(newBlock);

  return newBlock;
};

Blockchain.prototype.getLastBlock = function () {
  return this.chain[this.chain.length - 1];
};

Blockchain.prototype.createNewTransaction = function (
  amount,
  sender,
  recipient
) {
  const newTransaction = {
    transactionId: uuidv1().split("-").join(""),
    amount,
    sender,
    recipient
  };

  return newTransaction;
};

Blockchain.prototype.addToPendingTrans = function (transaction) {
  this.pendingTransactions.push(transaction);

  return this.getLastBlock()["index"] + 1;
};

Blockchain.prototype.hashBlock = function (
  prevBlockHash,
  currBlockData,
  nonce
) {
  const dataAsString =
    prevBlockHash + nonce.toString() + JSON.stringify(currBlockData);

  const hash = sha256(dataAsString);

  return hash;
};

Blockchain.prototype.proofOfWork = function (prevBlockHash, currBlockData) {
  let nonce = 0;
  let hash = this.hashBlock(prevBlockHash, currBlockData, nonce);

  while (hash.substring(0, 4) !== "0000") {
    nonce++;
    hash = this.hashBlock(prevBlockHash, currBlockData, nonce);
  }

  return nonce;
};

module.exports = Blockchain;
