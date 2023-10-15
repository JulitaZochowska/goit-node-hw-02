const joi = require("joi");

const userSchema = joi.object({
  email: joi.string().required(),
  password: joi.string().required(),
});

const emailBody = joi.object({
  email: joi.string().required(),
});

const userValidatorMiddleware = (req, res, next) => {
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.message });
  }

  return next();
};

const emailInBodyValidatorMiddleware = (req, res, next) => {
  const { error } = emailBody.validate(req.body);

  if (error) {
    return res.status(400).send({ error: error.message });
  }

  return next();
};

module.exports = {
  userValidatorMiddleware,
  emailInBodyValidatorMiddleware,
};
