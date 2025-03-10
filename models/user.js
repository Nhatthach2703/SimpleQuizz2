const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, default: "" },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
