// @desc Greeting
// @route GET /api/v1/blockchain
// @access Public
exports.greeting = (req, res) => {
  console.log(req.body);
  res.send(`The amount of the transaction is ${req.body.amount} testcoin`);
};
