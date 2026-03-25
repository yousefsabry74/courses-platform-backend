const Joi = require("joi");
function postCoursesValidator(obj) {
  const schema = Joi.object({
    title: Joi.string().required().trim(),
    description: Joi.string(),
    price: Joi.number().required(),
    reviews: Joi.array()
      .items(
        Joi.object({
          ratings: Joi.number().min(1).max(5),
          comment: Joi.string(),
        }),
      )
      .optional(),
  });
  return schema.validate(obj);
}
function updateCoursesValidator(obj) {
  const schema = Joi.object({
    title: Joi.string().trim(),
    description: Joi.string(),
    price: Joi.number(),
    reviews: Joi.array()
      .items(
        Joi.object({
          ratings: Joi.number().min(1).max(5),
          comment: Joi.string(),
        }),
      )
      .optional(),
  });
  return schema.validate(obj);
}
module.exports = { postCoursesValidator, updateCoursesValidator };
