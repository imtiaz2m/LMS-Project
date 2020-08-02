const { body, validationResult, oneOf, check } = require('express-validator');
const { ifErrors } = require('./helper');
const AdminModel = require('../models/admin')


exports.adminUpdate = [
    check('firstname').exists().withMessage('Details must be entered'),
    check('lastname').exists().withMessage('Details must be entered'),
    check('password').exists().withMessage('Details must be entered'),
    check('email').isEmail().trim().exists().customSanitizer(val => val.toLowerCase()).custom(async (val, { req }) => {
        if (await emailExists(val, req.session._id)) {
            return Promise.reject('Email already exists');
        }
    }),
    ifErrors
]
async function emailExists(value, id) {
    let admin = await AdminModel.findOne({ email: value.toLowerCase() })
    console.log('admin: ', admin);
    if (admin) {
        console.log('admin._id: ', admin._id);
        console.log('id: ', id);
        if (admin._id == id)
            return false
        else
            return true
    }
    else
        return false
}

async function adminExists(email) {
    let admin = await AdminModel.findOne({ email });
    console.log('admin: ', admin);
    return admin ? true : false;
}


exports.createAdmin = [
    check('firstname').exists(),
    check('lastname').exists(),
    check('password').exists(),
    check('email').isEmail().trim().exists().customSanitizer(val => val.toLowerCase()).custom(async (val, { req }) => {
        if (await adminExists(val)) {
            return Promise.reject('Email already exists');
        }
    }),
    ifErrors
]