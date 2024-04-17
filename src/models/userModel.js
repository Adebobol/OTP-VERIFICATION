const mongoose = require('mongoose')
const bcrypt = require('bcrypt')



const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Provide a username'],
        unique: [true, 'Username already exist']
    },
    password: {
        type: String,
        required: [true, 'Provide a password'],
        unique: [true, 'provide a strong password']
    },
    email: {
        type: String,
        required: [true, 'Provide a valid email'],
        unique: [true, 'email already exist']
    }
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password, 12)

    next()
})


userSchema.methods.comparePassword = async function (inputPassword, originalPassword) {
    return await bcrypt.compare(inputPassword, originalPassword)
}


const User = mongoose.model('User', userSchema)

module.exports = User