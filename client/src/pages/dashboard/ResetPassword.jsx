import { useState, useEffect } from 'react'
import { FormRow } from '../../components'
import Wrapper from '../../assets/wrapper/DashboardFormPage'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { resetUserPassword } from '../../features/user/userSlice'

const initialState = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
}

const ResetPassword = () => {
  const { isLoading, user } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  const [userData, setUserData] = useState(initialState)

  const handleSubmit = (e) => {
    e.preventDefault()
    const { oldPassword, newPassword, confirmNewPassword } = userData

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error('Please Fill Out All Fields')
      return
    }

    dispatch(
      resetUserPassword({ oldPassword, newPassword, confirmNewPassword })
    )
  }

  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value

    setUserData((prevData) => {
      return { ...prevData, [name]: value }
    })
  }

  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>Reset Password</h3>
        <div className="form-center">
          <FormRow
            type="password"
            name="oldPassword"
            labelText="Old Password"
            value={userData.oldPassword}
            handleChange={handleChange}
          />
          <FormRow
            type="password"
            name="newPassword"
            labelText="New Password"
            value={userData.newPassword}
            handleChange={handleChange}
          />
          <FormRow
            type="password"
            name="confirmNewPassword"
            labelText="Confirm New Password"
            value={userData.confirmNewPassword}
            handleChange={handleChange}
          />

          <button className="btn btn-block" type="submit" disabled={isLoading}>
            {isLoading ? 'Please Wait...' : 'reset password'}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default ResetPassword
