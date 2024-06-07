import { useEffect, useState } from 'react'
import UserNav from '../../fragments/navs/UserNav'
import BookService from '../../../api/service/BookService'
import Footer from '../../fragments/footers/Footer'

import AuthService from '../../../api/service/AuthService'
import AuthUser from '../../context/AuthUser'
import { useNavigate } from 'react-router-dom'

export default function MainPage() {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const navigateTo = useNavigate()

  const [authUser, setAuthUser] = useState(new AuthUser())
  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())

  // useEffect(() => {
  //   async function buildPage() {
  //     setIsLoading(true)
  //     const user = await authService.getAuthUser()

  //     console.log('fetch')

  //     console.log(user)
  //     if (user == null || !user.isAuthorized()) {
  //       navigateTo('/auth/login')
  //     } else {
  //       setAuthUser(user)

  //       const response = await bookService.getBooks()
  //       setBooks(response.data)
  //     }

  //     setIsLoading(false)
  //   }

  //   buildPage()
  // }, [])

  useEffect(() => {
    async function fetchAuthUser() {
      setIsLoading(true)

      if (!authUser.isAuthorized()) {
        const user = await authService.getAuthUser()

        console.log('fetch authuser')

        setAuthUser(user)
      } else {
        navigateTo('/auth/login')
      }
    }

    fetchAuthUser()
  }, [])

  useEffect(() => {
    async function fetchBooks() {
      const response = await bookService.getBooks()
      if (response.status == 200) {
        setBooks(response.data)
      }
      setIsLoading(false)
    }
    fetchBooks()
  }, [authUser])

  document.title = 'Головна сторінка'

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <UserNav user={authUser.user} />

      <div className="container-md container-small p-0 my-5">
        <div className="background-color border-radius p-3 my-3">
          <div className="rounded-top p-2">
            <div className="h4 p-1 text-truncate border-bottom border-2">
              Нещодавно добавлені
            </div>
          </div>

          {books.map((book, index) => (
            <div key={index} className="p-2 d-flex border-bottom border-2 mb-3">
              {book.bookImageUrl && (
                <img
                  style={{ maxWidth: '110px' }}
                  className="border-radius mr-2"
                  src={`${book.bookImageUrl}`}
                  alt="Фотографія"
                />
              )}
              <div className="p-3 text-truncate">
                <div className="border-bottom border-2">
                  <a className="elem-link" href={`/book/${book.id}`}>
                    {book.title}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <Footer />
      </div>
    </>
  )
}
