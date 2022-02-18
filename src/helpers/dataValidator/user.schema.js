/* eslint-disable max-len */
const joi = require('joi');

const schemaOptions= {
  abortEarly: false,
  stripUnknown: true,
};

const nameSchema = joi.string().regex(/^[A-za-z\s]+$/).required();
const userNameSchema = joi.string().min(5).max(20).regex(/[A-za-z1-9\s]+/).required();
const passwordSchema = joi.string().min(8).max(25).required();
const emailSchema = joi.string().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required();
const phoneNumberSchema = joi.string().required();

const signInSchema = joi.object({
  userName: userNameSchema,
  password: passwordSchema,
});

const signUpSchema = joi.object({
  firstName: nameSchema,
  lastName: nameSchema,
  userName: userNameSchema,
  email: emailSchema,
  phoneNumber: phoneNumberSchema,
  password: passwordSchema,
});

module.exports = {
  schemaOptions,
  signInSchema,
  signUpSchema,
};
