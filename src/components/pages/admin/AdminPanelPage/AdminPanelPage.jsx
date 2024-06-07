import { useEffect, useState } from 'react'
import UserNav from '../../../fragments/navs/UserNav'
import BookService from '../../../../api/service/BookService'
import userInfoStyles from '../../users/UserInfoPage/UserInfoPage.module.css'
import UserService from '../../../../api/service/UserService'
import AuthService from '../../../../api/service/AuthService'
import AuthUser from '../../../context/AuthUser'
import { createErrorToast, createSuccessToast } from '../../../util/toast'

export default function AdminPanelPage() {
  const [books, setBooks] = useState([
    {
      id: 0,
      title: '',
      description: '',
      amount: 0,
      bookImageUrl: null,
      uploadedUrl: null,
    },
  ])
  const [users, setUsers] = useState([
    { id: 0, username: '', userImageUrl: '' },
  ])

  const [isLoading, setIsLoading] = useState(false)
  const [authUser, setAuthUser] = useState(new AuthUser())

  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())
  const userService = new UserService(authService.getToken())

  useEffect(() => {
    async function fetchAuthUser() {
      setIsLoading(true)

      const user = await authService.getAuthUser()

      console.log('fetch')
      if (user.isAuthorized()) {
        setAuthUser(user)
      }
    }

    fetchAuthUser()
  }, [])

  useEffect(() => {
    async function fetchBooks() {
      const responseBooks = bookService.getBooks()
      setBooks((await responseBooks).data)
    }
    fetchBooks()
  }, [authUser])

  useEffect(() => {
    async function fetchChapters() {
      const responseUsers = userService.getUsers()

      setUsers((await responseUsers).data)
      setIsLoading(false)
    }
    fetchChapters()
  }, [authUser])

  async function deleteBook(bookId) {
    const response = await bookService.deleteBook(bookId)

    if (response.status == 200) {
      createSuccessToast('Книга була видалена')
    } else {
      createErrorToast('Сталася помилка при видаленні')
    }
  }

  document.title = 'Адмін панель'
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <UserNav user={authUser.getUser()} />

      <div className="container container-small my-5">
        <div className={`p-3 ${userInfoStyles.userInfo}`}>
          <div className="h6 p-3">Адміністративна панель</div>

          <div className="px-3 border-radius">
            <div
              className={`nav-tabs-horizontal nav nav-tabs ${userInfoStyles.navTabs}`}
              role="tablist"
            >
              <button
                className={`nav-link active ${userInfoStyles.navLink}`}
                data-bs-toggle="tab"
                data-bs-target="#actions"
              >
                Дії
              </button>
              <button
                className={`nav-link ${userInfoStyles.navLink}`}
                data-bs-toggle="tab"
                data-bs-target="#requests"
              >
                Запити
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Tab panes --> */}
        <div className="mt-3 tab-content pt-2">
          {/* <!-- Каталоги користувача --> */}
          <div className="tab-pane active" id="actions">
            <div className={`tabs ${userInfoStyles.tabs}`}>
              <div
                className={`nav nav-tabs ${userInfoStyles.navTabs} ${userInfoStyles.navTabsVertical}`}
                id="book-catalogs"
                role="tablist"
              >
                <button
                  className={`nav-link color-text ${userInfoStyles.navLink} active`}
                  data-bs-toggle="tab"
                  data-bs-target="#books"
                >
                  Книги
                </button>

                {authUser.isSUPERADMIN() && (
                  <button
                    className={`nav-link color-text ${userInfoStyles.navLink}`}
                    data-bs-toggle="tab"
                    data-bs-target="#users-list"
                  >
                    Користувачі
                  </button>
                )}
              </div>

              <div
                className={`${userInfoStyles.tabsContainer} tab-container tab-content`}
              >
                {/* <!-- All books --> */}
                <div className={`tab-pane active`} id="books">
                  <div className="my-2 d-flex justify-between-content">
                    <a href="/admin/book/create" className="btn btn-button">
                      Додати книгу
                    </a>
                  </div>
                  {books &&
                    books.map((book, i) => (
                      <div
                        key={book.id + i}
                        className={`tab border-radius text-truncate mb-2 ${userInfoStyles.tab}`}
                      >
                        {book?.bookImageUrl && (
                          <img
                            className={userInfoStyles.avatar}
                            src={book.bookImageUrl}
                            alt="Фото книжки"
                          />
                        )}
                        <div
                          className={`tab-inner text-truncate ${userInfoStyles.tabInner}`}
                        >
                          <div className="d-flex flex-column text-truncate p-2">
                            <a
                              className="elem-link text-truncate"
                              href={`/book/${book.id}`}
                            >
                              {book.title}
                            </a>

                            <div className="text-truncate">
                              {`Кількість розділів: ${book.amount}`}
                            </div>
                            {book.uploadedUrl && (
                              <a
                                className="elem-link text-truncate"
                                href={book.uploadedUrl}
                              >
                                Було взято з
                              </a>
                            )}
                          </div>
                          <div className="group-buttons">
                            <a
                              className="btn btn-button text-truncate mx-1"
                              href={`/admin/book/${book.id}/edit`}
                            >
                              <i className="bi bi-pencil"></i>
                            </a>

                            <button
                              className="btn btn-danger text-truncate mx-1"
                              onClick={() => deleteBook(book.id)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {authUser.isSUPERADMIN() && (
                  <div className="tab-pane" id="users-list">
                    {users &&
                      users.map((user, i) => (
                        <div
                          key={user.id * user.id}
                          className={`tab border-radius text-truncate mb-2 ${userInfoStyles.tab}`}
                        >
                          {user?.userImageUrl && (
                            <img
                              className={userInfoStyles.avatar}
                              src={user.userImageUrl}
                              alt="Фото користувача"
                            />
                          )}
                          <div
                            className={`tab-inner text-truncate ${userInfoStyles.tabInner}`}
                          >
                            <div className="d-flex flex-column text-truncate p-2">
                              <a
                                className="elem-link text-truncate"
                                href={`/user/${user.id}`}
                              >
                                {user.username}
                              </a>

                              <div className="text-truncate">
                                {`Роль: ${user.roleName}`}
                              </div>
                            </div>
                            <div className="group-buttons">
                              <a
                                className="btn btn-button text-truncate mx-1"
                                href={`/admin/user/${user.id}/edit`}
                              >
                                <i className="bi bi-pencil"></i>
                              </a>

                              <button className="btn btn-danger text-truncate mx-1">
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
