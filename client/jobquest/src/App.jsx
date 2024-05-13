import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  ErrorPage,
  LandingPage,
  ProtectedRoute,
  RegistrationPage,
} from './pages'
import {
  AddJobs,
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
} from './pages/dashboard'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Stats />} />
            <Route path="all-jobs" element={<AllJobs />} />
            <Route path="add-job" element={<AddJobs />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="landing" element={<LandingPage />} />
          <Route path="register" element={<RegistrationPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
