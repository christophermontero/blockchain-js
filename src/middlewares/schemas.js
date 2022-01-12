const Joi = require("joi");

exports.transactionSchema = function (transaction) {
  const schema = Joi.object({
    transactionId: Joi.string(),
    amount: Joi.number().min(0).required(),
    sender: Joi.string().min(2).max(64).required(),
    recipient: Joi.string().min(32).max(64).required()
  });

  return schema.validate(transaction);
};
