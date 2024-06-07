import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useNavigate,
} from 'react-router-dom'
import MainPage from '../pages/MainPage/MainPage'
import AuthService from '../../api/service/AuthService'
import { useEffect, useState } from 'react'
import AuthUser from '../context/AuthUser'

export default function MainRoutes() {
  // const [authUser, setAuthUser] = useState(new AuthUser())

  // const nav = useNavigate()
  // const authService = new AuthService()

  // useEffect(() => {
  //   async function checkAuthorization() {
  //     const user = await authService.getAuthUser()

  //     if (user == null || !user.isAuthorized()) {
  //       nav('/auth/login')
  //     } else {
  //       setAuthUser(user)
  //       nav('/', { replace: true })
  //     }
  //   }

  //   checkAuthorization()
  // }, [])

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
    </Routes>
  )
}
