const express = require('express')
const router = express.Router()

const AuthController = require('../controller/authController')

router.post('/signup', AuthController.signUp)
router.get('/verifyOtp', AuthController.verifyOTP)
router.post('/resend', AuthController.resend_OTP)
router.post('/signin', AuthController.signIn)






module.exports = router