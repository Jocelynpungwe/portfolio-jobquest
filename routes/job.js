const express = require('express')
const router = express.Router()

const {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  getJob,
  showStats,
} = require('../controllers/jobs')
const testUserMiddleware = require('../middleware/testUser')

router.route('/').post(createJob).get(getAllJobs)
router.route('/stats').get(showStats)

router
  .route('/:id')
  .get(getJob)
  .delete(testUserMiddleware, deleteJob)
  .patch(testUserMiddleware, updateJob)

module.exports = router
