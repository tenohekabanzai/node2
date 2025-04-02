const Joi = require('Joi')

const validateRegistration = (data)=>{
    const schema = Joi.object({
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    return schema.validate(data);
}

module.exports = {validateRegistration}