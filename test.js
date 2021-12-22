const Blockchain = require("./blockchain");

const testCoin = new Blockchain();

testCoin.createNewBlock(2056, "previousHash1", "currentHash1");

testCoin.createNewTransaction(100, "senderAddress", "recipientAddress");

testCoin.createNewBlock(29320483, "previousHash2", "currentHash2");

testCoin.createNewTransaction(50, "senderAddress", "recipientAddress");
testCoin.createNewTransaction(300, "senderAddress", "recipientAddress");
testCoin.createNewTransaction(500, "senderAddress", "recipientAddress");

testCoin.createNewBlock(2932, "previousHash3", "currentHash3");

console.log(testCoin.chain[2]);
