import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import customeFetch from '../../utils/fetchCustome'
import { toast } from 'react-toastify'

import {
  addUserToLocalStorage,
  getUserFromLocalStorage,
  removeUserFromLocalStorage,
} from '../../utils/localStorage'
import { clearValues } from '../job/jobSlice'
import { clearAllJobsState } from '../allJobs/allJobsSlice'
import authHeader from '../../utils/authHeader'
const initialState = {
  isLoading: false,
  isSideBarOpen: false,
  user: getUserFromLocalStorage(),
}

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user, thunkAPI) => {
    try {
      const { data } = await customeFetch.post('/auth/register', user)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const loginUser = createAsyncThunk(
  'user/login',
  async (user, thunkAPI) => {
    try {
      const { data } = await customeFetch.post('/auth/login', user)

      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

export const updateUser = createAsyncThunk(
  '/user/update',
  async (user, thunkAPI) => {
    try {
      const { data } = await customeFetch.patch(
        '/auth/updateUser',
        user,
        authHeader(thunkAPI)
      )

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

export const uploadUserProfile = createAsyncThunk(
  'user/profile',
  async (image, thunkAPI) => {
    try {
      const { data } = await customeFetch.patch('/auth/upload', image, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${thunkAPI.getState().user.user.token}`,
        },
      })

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

export const clearStore = createAsyncThunk(
  'user/clear',
  async (message, thunkAPI) => {
    try {
      thunkAPI.dispatch(logoutUser(message))
      thunkAPI.dispatch(clearAllJobsState())
      thunkAPI.dispatch(clearValues())
      return thunkAPI.fulfillWithValue('Logging Out...')
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.msg)
    }
  }
)

const userSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    toggleSideBar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen
    },
    logoutUser: (state, { payload }) => {
      state.user = null
      state.isSideBarOpen = false
      removeUserFromLocalStorage()
      if (payload) {
        toast.success(payload)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state, { payload }) => {
        state.isLoading = true
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        const { user } = payload
        state.isLoading = false
        state.user = user
        toast.success(`Hello There ${user.name}`)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        const { user } = payload
        state.isLoading = false
        state.user = user
        toast.success(`Welcome Back ${user.name}`)
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        const { user } = payload
        state.isLoading = false
        state.user = user
        addUserToLocalStorage(user)
        toast.success(`User Updated`)
      })
      .addCase(updateUser.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
      .addCase(clearStore.rejected, (state) => {
        toast.error('There was an error')
      })
      .addCase(uploadUserProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(uploadUserProfile.fulfilled, (state, { payload }) => {
        const { user } = payload
        state.isLoading = false
        state.user = user
        addUserToLocalStorage(user)
        toast.success(`Profile Picture Updated`)
      })
      .addCase(uploadUserProfile.rejected, (state, { payload }) => {
        state.isLoading = false
        toast.error(payload)
      })
  },
})

export const { toggleSideBar, logoutUser } = userSlice.actions
export default userSlice.reducer
