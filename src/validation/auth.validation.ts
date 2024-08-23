import Joi from 'joi'

export const RegisterValidation=Joi.object().keys({
    fullName:Joi.string().required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string().min(6).required(),
    gender: Joi.string().valid("male","female").required(),
    profilePic:Joi.string().optional()

})

export const LoginValidation=Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required()
})