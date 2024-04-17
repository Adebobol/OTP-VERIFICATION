const User = require('./../models/userModel')
const jwt = require('jsonwebtoken')
const otpGenerator = require('otp-generator')
const { promisify } = require('util')

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })
}

exports.register = async (req, res, next) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    })
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
}


exports.login = async (req, res, next) => {
    const { username, password } = req.body

    if (!username || !password) {
        return
    }

    const user = await User.findOne({ username }).select('password')


    if (!user || !(await user.comparePassword(password, user.password))) {

        return
    }

    const token = signToken(user._id)

    res.status(200).json({
        status: 'success',
        token
    })
}


exports.getUser = async (req, res, next) => {
    const user = await User.findOne({ username: req.params.username })
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    })
}


exports.getAllUsers = async (req, res, next) => {
    const users = await User.find()
    console.log(users)
}


exports.updateUser = async (req, res, next) => {
    if (req.body.password || req.body.email) {
        return
    }
    const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!newUser) {
        return
    }


    console.log(newUser)
}

exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]
    }
    if (!token) {
        return
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decoded.id)
    if (!currentUser) {
        return
    }

    // Need to check if user changed password after login in


    req.user = currentUser
    next()
}

exports.storeOtp = (req, res, next) => {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }
    next()
}




exports.generateOTP = async (req, res, next) => {

    req.app.locals.OTP = await otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })

    res.status(201).json({
        status: "success",
        data: {
            OTP: req.app.locals.OTP
        }
    })
}

exports.verifyOTP = async (req, res, next) => {
    const { otpCode } = req.body

    if (!otpCode) return

    if (parseInt(otpCode) !== parseInt(req.app.locals.OTP)) return

    res.status(200).json({
        status: "success",
        message: "verification successful"
    })


}


// exports.registerMail = async (req, res, next) => { }