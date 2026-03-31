const Joi = require("joi");
function lessonValidation(obj) {
  const schema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required().trim(),
    icon: Joi.string().required(),
    color: Joi.string().required(),
    sessions: Joi.number().required(),
    available: Joi.boolean().default(true),
  });
  return schema.validate(obj);
}
module.exports = { lessonValidation };
