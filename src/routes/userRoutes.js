const express = require('express')
const router = express.Router()

const authCtrl = require('./../controllers/authenticationCtrl')


// POST
router.route('/register').post(authCtrl.register)
router.route('/login').post(authCtrl.login)
// router.route('/registerMail').post()


// // GET
router.route('/users').get(authCtrl.protect, authCtrl.getAllUsers)
router.route('/users/:username').get(authCtrl.getUser)
router.route('/generateOTP').get(authCtrl.protect, authCtrl.storeOtp, authCtrl.generateOTP)
router.route('/verifyOTP').get(authCtrl.verifyOTP)


// // PATCH
router.route('/:id/updateUser').patch(authCtrl.protect, authCtrl.updateUser)
// router.route('/protect').post(authCtrl.protect)


module.exports = router