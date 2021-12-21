function Blockchain() {
  this.chain = [];
  this.newTransations = [];
}

Blockchain.prototype.createNewBlock = function (nonce, prevBlockHash, hash) {
  const newBlock = {
    index: this.chain.length + 1,
    timestamp: Date.now(),
    transactions: this.newTransations,
    nonce,
    hash,
    prevBlockHash
  };

  this.newTransations = [];
  this.chain.push(newBlock);

  return newBlock;
};

module.exports = Blockchain;
