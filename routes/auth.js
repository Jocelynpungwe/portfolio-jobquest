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
router.post('/register', registerUser)

router.post('/login', loginUser)

router.patch('/upload', authenticationMiddleware, uploadUserProfile)
router.post('/password', authenticationMiddleware, changePassword)
router.patch(
  '/updateUser',
  authenticationMiddleware,

  updateUser
)

module.exports = router
