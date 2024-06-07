import {
  BrowserRouter,
  Route,
  Router,
  Routes,
  useParams,
} from 'react-router-dom'
import BookPage from '../pages/books/BookPage/BookPage'
import ChapterPage from '../pages/chapters/ChapterPage/ChapterPage'
import AuthService from '../../api/service/AuthService'
import AuthUser from '../context/AuthUser'

export default function BookRoutes() {
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
      <Route path="/:id" element={<BookPage />}></Route>
      <Route
        path="/:bookId/ch/:chapterNumber"
        element={<ChapterPage />}
      ></Route>
    </Routes>
  )
}
