import { Route, Routes } from 'react-router-dom'
import CatalogPage from '../pages/books/CatalogPage/CatalogPage'
import AuthUser from '../context/AuthUser'
import AuthService from '../../api/service/AuthService'

export default function CatalogRoutes() {
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
      <Route path="/" element={<CatalogPage />}></Route>
    </Routes>
  )
}
