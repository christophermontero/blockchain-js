const Joi = require("joi");

exports.transactionSchema = function (transaction) {
  const schema = Joi.object({
    transactionId: Joi.string(),
    amount: Joi.number().min(0).required(),
    sender: Joi.string().min(64).max(64).required(),
    recipient: Joi.string().min(64).max(64).required()
  });

  return schema.validate(transaction);
};
