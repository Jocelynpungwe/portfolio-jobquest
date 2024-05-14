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

router.post(
  '/upload',
  authenticationMiddleware,
  testUserMiddleware,
  uploadUserProfile
)
router.post(
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
