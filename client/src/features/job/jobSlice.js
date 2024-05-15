import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import customeFetch from '../../utils/fetchCustome'
import { getUserFromLocalStorage } from '../../utils/localStorage'
import { logoutUser } from '../user/userSlice'
import { showLoading, hideLoading, getAllJobs } from '../allJobs/allJobsSlice'
import authHeader from '../../utils/authHeader'
const initialState = {
  isLoading: false,
  position: '',
  company: '',
  jobLocation: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  isEditing: false,
  editJobId: '',
}

export const createJob = createAsyncThunk(
  'job/create',
  async (job, thunkAPI) => {
    try {
      const { data } = await customeFetch.post(
        '/jobs',
        job,
        authHeader(thunkAPI)
      )
      thunkAPI.dispatch(clearValues())
      return data
    } catch (error) {
      if (error.response.status === 401) {
        thunkAPI.dispatch(logoutUser())
        return thunkAPI.rejectWithValue('Unauthorized! Logging Out...')
      }
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const deleteJob = createAsyncThunk(
  'job/delete',
  async (id, thunkAPI) => {
    thunkAPI.dispatch(showLoading())
    try {
      const { data } = await customeFetch.delete(
        `/jobs/${id}`,
        authHeader(thunkAPI)
      )
      thunkAPI.dispatch(getAllJobs())
      return data
    } catch (error) {
      thunkAPI.dispatch(hideLoading())
      thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const editJob = createAsyncThunk(
  'job.edit',
  async ({ job, jobId }, thunkAPI) => {
    try {
      const { data } = await customeFetch.patch(
        `/jobs/${jobId}`,
        job,
        authHeader(thunkAPI)
      )
      thunkAPI.dispatch(clearValues())

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const jobSlice = createSlice({
  name: 'job',
  initialState,
  reducers: {
    handleChange: (state, { payload }) => {
      const { name, value } = payload
      state[name] = value
    },
    clearValues: (state) => {
      return {
        ...initialState,
        jobLocation: getUserFromLocalStorage()?.location || '',
      }
    },
    setEditJob: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createJob.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createJob.fulfilled, (state, { payload }) => {
        state.isLoading = false
        toast.success('Job Created')
      })
      .addCase(createJob.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(editJob.pending, (state) => {
        state.isLoading = true
      })
      .addCase(editJob.fulfilled, (state) => {
        state.isLoading = false
        toast.success('Job Modified...')
      })
      .addCase(editJob.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
  },
})

export const { handleChange, clearValues, setEditJob } = jobSlice.actions
export default jobSlice.reducer
