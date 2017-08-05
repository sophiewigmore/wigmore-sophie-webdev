var mongoose = require('mongoose');
var userSchema = require('./user.schema.server');
var db = require("../models.server");
var userModel = mongoose.model('UserModel', userSchema);

userModel.createUser = createUser;
userModel.findUserById = findUserById;
userModel.updateUser = updateUser;
userModel.findUserByCredentials = findUserByCredentials;
module.exports = userModel;

function createUser(user) {
    return userModel.create(user);//asynchronous call to db, and returns a promise
}

function findUserById(userId) {
    return userModel.findById(userId);
}

function updateUser(userId, user) {
    return userModel.update({_id: userId},
        {$set: user});
}

function findUserByCredentials(username, password) {
    return userModel.findOne({username: username, password: password});
}