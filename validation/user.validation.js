const Joi = require("joi");
const { User } = require("../model/userSchema");
function registerValidation(obj) {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),

    password: Joi.string().min(6).max(30).required(),
    email: Joi.string().email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    }),
    age: Joi.number().min(10).max(100),
    role: Joi.string().valid("user", "admin").default("user"),
  });
  return schema.validate(obj, { abortEarly: false });
}

module.exports = { registerValidation };
