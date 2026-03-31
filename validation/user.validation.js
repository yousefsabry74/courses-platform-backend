const Joi = require("joi");
function registerValidation(obj) {
  const schema = Joi.object({
    username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).min(3).max(30).required(),

    password: Joi.string().min(6).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    class: Joi.string().required(),
    grade: Joi.number(),
    displayName: Joi.string(),
    age: Joi.number().min(10).max(100),
    role: Joi.string().valid("student", "teacher").default("student"),
  });
  return schema.validate(obj, { abortEarly: false });
}

module.exports = { registerValidation };
