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

router.post('/register', registerUser)

router.post('/login', loginUser)

router.post('/upload', authenticationMiddleware, uploadUserProfile)
router.post('/password', authenticationMiddleware, changePassword)
router.patch('/updateUser', authenticationMiddleware, updateUser)

module.exports = router
