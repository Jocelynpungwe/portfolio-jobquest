const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')
const User = require('../models/User')
const path = require('path')
const fs = require('fs')

const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('Please Provide Credentials')
  }

  const user = await User.create({
    name,
    email,
    password,
  })

  const token = user.createJWT()

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      profile: user.image,
      location: user.location,
      email: user.email,
      token,
    },
  })
}

const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const isPassword = await user.comparePassword(password)

  if (!isPassword) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const token = user.createJWT()

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      profile: user.image,
      location: user.location,
      email: user.email,
      token,
    },
  })
}

const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError('Please provide all values')
  }

  const user = await User.findOneAndUpdate({ _id: req.user.userId }, req.body, {
    new: true,
    runValidators: true,
  })

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const token = user.createJWT()

  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      profile: user.image,
      location: user.location,
      email: user.email,
      token,
    },
  })
}

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body

  if (!oldPassword || !newPassword || !confirmNewPassword) {
    throw new BadRequestError('Please Provide all password')
  }

  const user = await User.findOne({ _id: req.user.userId })

  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  const isPassword = await user.comparePassword(oldPassword)

  if (!isPassword) {
    throw new UnauthenticatedError('Old Password Invalid')
  }

  if (oldPassword === newPassword) {
    throw new BadRequestError('New Password cannot be Old Password')
  }

  if (newPassword !== confirmNewPassword) {
    throw new BadRequestError('Confirm Password must match New Password ')
  }

  user.password = newPassword
  user.save()

  res.status(StatusCodes.OK).json({ msg: 'Password Changed Successfull' })
}

const uploadUserProfile = async (req, res) => {
  if (!req.files) {
    const user = await User.findOneAndUpdate(
      { _id: req.user.userId },
      {
        image: `/profile/defaultProfile.jpg`,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({
      user: {
        name: user.name,
        lastName: user.lastName,
        profile: user.image,
        location: user.location,
        email: user.email,
        token,
      },
    })
    return
  }

  const profilePicture = req.files.image

  if (profilePicture.length > 1) {
    throw new BadRequestError('Upload One File')
  }

  if (!profilePicture.mimetype.startsWith('image')) {
    throw new BadRequestError('Please Upload Image')
  }

  const maxSize = 1024 * 1024
  if (profilePicture.size > maxSize) {
    throw new BadRequestError('Please upload image smaller 1MB')
  }

  const imagePath = path.join(
    __dirname,
    `../image/profile/${profilePicture.name}`
  )
  await profilePicture.mv(imagePath)

  const user = await User.findOne({ _id: req.user.userId })
  const oldImage = user.image

  if (oldImage !== '/profile/defaultProfile.jpg') {
    const oldImagePath = path.join(__dirname, `../image${oldImage}`)

    fs.unlink(oldImagePath, (err) => {
      if (err) {
        console.error('Error deleting the file:', err)
      }
    })
  }

  const userProfile = await User.findOneAndUpdate(
    { _id: req.user.userId },
    {
      image: `/profile/${profilePicture.name}`,
    },
    {
      new: true,
      runValidators: true,
    }
  )

  const token = userProfile.createJWT()

  res.status(StatusCodes.OK).json({
    user: {
      name: userProfile.name,
      lastName: userProfile.lastName,
      profile: userProfile.image,
      location: userProfile.location,
      email: userProfile.email,
      token,
    },
  })
}

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  uploadUserProfile,
  changePassword,
}
