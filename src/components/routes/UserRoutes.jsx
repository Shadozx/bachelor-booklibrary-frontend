import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import UserInfoPage from '../pages/users/UserInfoPage/UserInfoPage'
import AuthService from '../../api/service/AuthService'
import AuthUser from '../context/AuthUser'

export default function UserRoutes() {
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
      <Route path="/:userId" element={<UserInfoPage />} />
    </Routes>
  )
}
