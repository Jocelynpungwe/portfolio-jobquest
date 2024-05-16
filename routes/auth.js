const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  updateUser,
  uploadUserProfile,
  changePassword,
} = require('../controllers/auth')
const authenticationMiddleware = require('../middleware/authentication')
const testUserMiddleware = require('../middleware/testUser')
const rateLimiter = require('express-rate-limit')

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: 'Too many requests from this IP, please try again after 15 minutes',
  },
})

router.post('/register', apiLimiter, registerUser)

router.post('/login', apiLimiter, loginUser)

router.patch(
  '/upload',
  authenticationMiddleware,
  testUserMiddleware,
  uploadUserProfile
)
router.patch(
  '/password',
  authenticationMiddleware,
  testUserMiddleware,
  changePassword
)
router.patch(
  '/updateUser',
  authenticationMiddleware,
  testUserMiddleware,
  updateUser
)

module.exports = router
