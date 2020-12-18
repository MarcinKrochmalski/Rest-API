const mongoose = require('mongoose');
const Bcrypt = require('bcryptjs');
const passwordValidator = require('password-validator');
const emailValidator = require("email-validator");

const passValidator = new passwordValidator()
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().not().spaces();

const userModel = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    },
    modified: {
        type: Date,
        default: Date.now
    }
});

//validate
userModel.path('username').validate(function (username) {
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    return usernameRegex.test(username);
}, 'The username value is invalid')

userModel.path('email').validate(function (email) {
    return emailValidator.validate(email);
}, 'The e-mail value is invalid')

userModel.path('password').validate(function (password) {
    return passValidator.validate(password);
}, 'Password must contain at least 8 characters. Number and upper and lower case letters.')

userModel.pre('save', function (next) {
    if (this.password)
        this.password = Bcrypt.hashSync(this.password, 10);
    next();
});
userModel.pre('updateOne', function (next) {
    this.findOneAndUpdate({}, { password: Bcrypt.hashSync(this.getUpdate().$set.password, 10) });
    next();
});

module.exports = mongoose.model('user', userModel);