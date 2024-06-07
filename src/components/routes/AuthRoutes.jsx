import { Route, Routes } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage/LoginPage'
import RegistrationPage from '../pages/auth/RegistrationPage/RegistrationPage'

export default function AuthRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/registration" element={<RegistrationPage />}></Route>
    </Routes>
  )
}
