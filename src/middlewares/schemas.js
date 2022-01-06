const Joi = require("joi");

exports.transactionSchema = function (transaction) {
  const schema = Joi.object({
    amount: Joi.number().min(0).required(),
    sender: Joi.string().min(0).required(),
    recipient: Joi.string().min(0).required()
  });

  return schema.validate(transaction);
};
