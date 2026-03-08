const Joi = require("joi");
function postCoursesValidator(obj) {
  const schema = Joi.object({
    title: Joi.string().required().trim(),
    price: Joi.number().required(),
  });
  return schema.validate(obj);
}
function updateCoursesValidator(obj) {
  const schema = Joi.object({
    title: Joi.string().trim(),
    price: Joi.number(),
  });
  return schema.validate(obj);
}
module.exports={postCoursesValidator,updateCoursesValidator}