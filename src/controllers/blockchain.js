const Blockchain = require("../../blockchain");

const testcoin = new Blockchain();

// @desc Get entire blockchain
// @route GET /api/v1/blockchain
// @access Public
exports.getBlockchain = (req, res) => {
  res.send(testcoin);
};
