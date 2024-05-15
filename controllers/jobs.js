const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const Jobs = require('../models/Jobs')
const mongoose = require('mongoose')
const moment = require('moment')

const createJob = async (req, res) => {
  const { company, position } = req.body

  if (!company || !position) {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }

  req.body.createdBy = req.user.userId
  const job = await Jobs.create({ ...req.body })
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const { company, position } = req.body
  const { id: jobId } = req.params
  if (!company || !position) {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }

  const job = await Jobs.findOneAndUpdate(
    {
      createdBy: req.user.userId,
      _id: jobId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const getAllJobs = async (req, res) => {
  const { search, status, jobType, sort, page: pageNo } = req.query
  const queryObject = { createdBy: req.user.userId }

  if (search) {
    queryObject.position = { $regex: search, $options: 'i' }
  }

  if (status && status !== 'all') {
    queryObject.status = status
  }

  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType
  }

  let result = Jobs.find(queryObject)

  if (sort === 'latest') {
    result = result.sort('-createdAt')
  }
  if (sort === 'oldest') {
    result = result.sort('createdAt')
  }
  if (sort === 'a-z') {
    result = result.sort('position')
  }
  if (sort === 'z-a') {
    result = result.sort('-position')
  }

  const page = Number(pageNo) || 1
  const limit = Number(req.params.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const jobs = await result

  const totalJobs = await Jobs.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalJobs / limit)

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages })
}
const getJob = async (req, res) => {
  const { id: jobId } = req.params
  const job = await Jobs.findOne({ createdBy: req.user.userId, _id: jobId })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params
  const job = await Jobs.findOneAndDelete({
    createdBy: req.user.userId,
    _id: jobId,
  })
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json()
}

const showStats = async (req, res) => {
  const uid = mongoose.Types.ObjectId.createFromHexString(req.user.userId)

  let jobStatusStats = await Jobs.aggregate([
    {
      $match: {
        createdBy: uid,
      },
    },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  jobStatusStats = jobStatusStats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  const defaultStats = {
    pending: jobStatusStats.pending || 0,
    interview: jobStatusStats.interview || 0,
    declined: jobStatusStats.declined || 0,
  }

  let monthlyApplications = await Jobs.aggregate([
    { $match: { createdBy: uid } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ])

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y')
      return { date, count }
    })
    .reverse()

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

module.exports = {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  showStats,
}
