import { useNavigate, useParams } from 'react-router-dom'

import { useState, useEffect } from 'react'
import AuthService from '../../../../api/service/AuthService'
import BookMarkService from '../../../../api/service/BookMarkService'
import UserService from '../../../../api/service/UserService'
import BookService from '../../../../api/service/BookService'
import ChapterService from '../../../../api/service/ChapterService'
import BookRatingService from '../../../../api/service/BookRating'
import CommentService from '../../../../api/service/CommentService'
import AuthUser from '../../../context/AuthUser'

import UserNav from '../../../fragments/navs/UserNav'
import CommentsList from '../../../fragments/lists/comments/CommentsList'
import Footer from '../../../fragments/footers/Footer'

import { createSuccessToast, createErrorToast } from '../../../util/toast'
import './BookPage.css'
import Loader from '../../../fragments/Loader'

export default function BookPage() {
  const { id } = useParams()

  const [authUser, setAuthUser] = useState(new AuthUser())
  const [book, setBook] = useState({ id: 0, title: '' })
  const [comments, setComments] = useState([])

  const [bookRating, setBookRating] = useState({ rating: 0 })
  const [focusedStar, setFocusedStar] = useState(0)

  const [bookMark, setBookMark] = useState(null)
  const [selectedCatalogId, setSelectedCatalogId] = useState(null)

  const [bookMarkChapter, setBookMarkChapter] = useState(null)
  const [chapters, setChapters] = useState([])
  const [userCatalogs, setUserCatalogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())
  const bookratingService = new BookRatingService(authService.getToken())
  const bookMarkService = new BookMarkService(authService.getToken())
  const chapterService = new ChapterService(authService.getToken())
  const userService = new UserService(authService.getToken())
  const commentService = new CommentService(authService.getToken())

  const nav = useNavigate()

  function collapse() {
    const descr = document.getElementById('description-content')

    const btn = document.getElementById('btn-collaps')

    if (btn.textContent === 'Детальніше') {
      descr.style = 'max-height:none;'
      btn.textContent = 'Згорнути'
    } else {
      descr.style = 'max-height:100px'
      btn.textContent = 'Детальніше'
    }
  }

  async function fetchChapters() {
    if (chapters.length == 0) {
      console.log("fetching book's chapters")

      const response = chapterService.getChaptersByBook(id)

      setChapters((await response).data)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    async function fetchAuthUser() {
      const user = await authService.getAuthUser()

      console.log('fetch')

      if (user.isAuthorized()) {
        setAuthUser(user)
      } else {
        nav('/auth/login')
      }
    }

    fetchAuthUser()
  }, [id])

  useEffect(() => {
    async function fetchBook() {
      if (id) {
        const responseBook = await bookService.getBook(id)
        if (responseBook.status == 200) {
          console.log('fetch book')
          setBook(responseBook.data)
        }
      }
    }

    fetchBook()
  }, [authUser])

  useEffect(() => {
    async function fetchBookRating() {
      console.log('fetch rating')
      if (id && authUser.getUser()?.id) {
        const response = await bookratingService.getBookRatingByOwnerAndBook(
          authUser.getUser()?.id,
          id
        )

        if (response.status == 200) {
          setBookRating(response.data)

          console.log('Response rating:' + response.data.rating)

          setFocusedStar(response.data.rating)
        }
      }
    }
    fetchBookRating()
  }, [book])

  useEffect(() => {
    async function fetchComments() {
      if (book && book?.id) {
        const response = await commentService.getBookComments(book.id)

        if (response.status == 200) {
          setComments(response.data)
        }
      }
    }
    fetchComments()
  }, [book])

  useEffect(() => {
    async function fetchUserCatalogs() {
      if (authUser.getUser()?.id) {
        const responseCatalogs = await userService.getCatalogs(
          authUser.getUser().id
        )

        if (responseCatalogs.status == 200) {
          console.log('fetch user catalogs')
          setUserCatalogs(responseCatalogs.data)
        }
      }
    }

    fetchUserCatalogs()
  }, [book])

  useEffect(() => {
    async function fetchBookMark() {
      if (authUser.isAuthorized()) {
        console.log('fetch bookmark')

        try {
          const responseBookMark =
            await bookMarkService.getBookMarkByOwnerAndBook(
              authUser.getUser().id,
              id
            )

          if (responseBookMark.status == 200) {
            console.log('fetch bookmark')

            const mark = responseBookMark.data

            setBookMark(mark)
            setSelectedCatalogId(mark.catalogId)

            if (id && mark.chapterId) {
              const responseChapter = await chapterService.getChapterById(
                id,
                mark.chapterId
              )

              if (responseChapter.status == 200) {
                console.log('fetch chapter mark')
                const markChapter = responseChapter.data

                setBookMarkChapter(markChapter)
              }
            }
          }
        } catch (e) {
          console.log('Message:' + e)
        }
      }

      setIsLoading(false)
    }

    fetchBookMark()
  }, [userCatalogs])

  async function addBookMark(e) {
    const newCatalogId = e.target.value

    console.log('New catalog id:' + newCatalogId)
    console.log('Selected catalog id:' + selectedCatalogId)
    if (newCatalogId && newCatalogId !== selectedCatalogId) {
      setSelectedCatalogId(newCatalogId)
      try {
        const response = await bookMarkService.createBookMark(
          newCatalogId,
          book.id
        )
        if (response.status === 201) {
          createSuccessToast('Закладка була оновлена')
        } else {
          createErrorToast('Щось пішло не так')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  async function addBookRating(value) {
    const newRating = value

    if (bookRating.rating == 0) {
      if (newRating) {
        try {
          const response = await bookratingService.createBookRating(
            authUser.getUser().id,
            book.id,
            newRating
          )
          if (response.status === 201) {
            setBookRating(bookRating)
            createSuccessToast('Оцінка була додана')
          } else {
            createErrorToast('Щось пішло не так з додавання оцінки')
          }
        } catch (error) {
          console.error('Error:', error)
        }
      }
    } else if (newRating && newRating !== bookRating.rating) {
      bookRating.rating = newRating
      setBookRating(bookRating)
      try {
        const response = await bookratingService.updateBookRating(
          authUser.getUser().id,
          bookRating.id,
          newRating
        )

        console.log(response)
        if (response.status === 200) {
          createSuccessToast('Оцінка була оновлена')
        } else {
          createErrorToast('Щось пішло не так з оновленням оцінки')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    } else {
      try {
        const response = await bookratingService.deleteBookRating(
          authUser.getUser().id,
          bookRating.id
        )

        console.log(response)
        if (response.status === 200) {
          console.log('delete rating')
          createSuccessToast('Оцінка була видалена')
          setBookRating({ rating: 0 })
        } else {
          createErrorToast('Щось пішло не так з видаленням оцінки')
        }
      } catch (error) {
        console.error('Error:', error)
      }
    }
  }

  async function deleteMark() {
    if (bookMark) {
      const response = await bookMarkService.deleteBookMark(
        bookMark.catalogId,
        bookMark.id
      )

      if (response.status == 200) {
        createSuccessToast('Закладка була видалена')
      } else {
        createErrorToast('Сталася помилка при видаленні закладки')
      }
    }
  }

  async function createComment(text) {
    console.log('create comment')
    const response = await commentService.createBookComment(
      authUser.getUser().id,
      book.id,
      text
    )
    console.log(response)

    if (response.status == 201) {
      createSuccessToast('Коментарій був доданий')
    } else {
      createErrorToast('Сталася помилка при додаванні коментарія')
    }
  }

  if (isLoading) {
    return <Loader />
  }

  document.title = book.title

  return (
    <>
      <UserNav user={authUser.getUser()} />
      <div className="container container-small my-5">
        <div className="border-radius my-3">
          <div className="book mb-3">
            <div className="mx-auto" style={{ maxWidth: '200px' }}>
              {/* <!-- Book image--> */}
              {book.bookImageUrl && (
                <div className="mb-3">
                  <img
                    className="border-radius text-center"
                    src={book.bookImageUrl}
                    alt="Фотографія"
                  />
                </div>
              )}

              {/* <!-- Buttons--> */}
              <div style={{ width: '100%' }}>
                {!bookMark ? (
                  <a
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    href={`/book/${book.id}/ch/1`}
                  >
                    Почати
                  </a>
                ) : (
                  <a
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                    href={
                      bookMarkChapter
                        ? `/book/${book.id}/ch/${bookMarkChapter.chapterNumber}`
                        : `/book/${book.id}/ch/1`
                    }
                  >
                    Продовжити
                  </a>
                )}

                {/* <a
                  className="mt-2 btn btn-button"
                  style={{ width: '100%' }}
                  href={'/book/1/full-read'}
                >
                  Читати повністю
                </a> */}
                {authUser.isAuthorized() && userCatalogs.length > 0 && (
                  <div>
                    <select
                      id="add-bookmark"
                      value={selectedCatalogId || ''}
                      onChange={addBookMark}
                      className="btn text-center my-2 select form-select form-select-sm"
                      aria-label=".form-select-sm example"
                    >
                      <option
                        className="color-text"
                        selected={bookMark == null}
                      >
                        Виберіть каталог
                      </option>
                      {userCatalogs &&
                        userCatalogs.length > 0 &&
                        userCatalogs.map((c, i) => (
                          <option
                            className="color-text"
                            value={c.id}
                            text={c.title}
                            selected={
                              bookMark != null && bookMark.catalogId == c.id
                            }
                          >
                            {c.title}
                          </option>
                        ))}
                    </select>

                    {bookMark != null && (
                      <button
                        th:onclick="|deleteMark(${mark.id})|"
                        className="btn btn-danger color-text"
                        style={{ width: '100%' }}
                        onClick={deleteMark}
                      >
                        Видалити закладку
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="book-info border-radius">
              {/* Book name  */}
              <div className="h2 p-2 text-break">{book.title}</div>

              <div
                className="p-2 d-flex justify-content-between"
                style={{ maxWidth: '100px' }}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <div
                    key={value}
                    className={`star ${
                      value <= bookRating.rating ? 'selected' : ''
                    } ${value <= focusedStar ? 'focused' : ''}`}
                    onClick={() => addBookRating(value)}
                    onMouseEnter={() => setFocusedStar(value)}
                    onMouseLeave={() => setFocusedStar(0)}
                  >
                    &#9733;
                  </div>
                ))}
              </div>

              <div className="background-color p-3 border-radius">
                <ul className="nav nav-tabs">
                  <li className="nav-item">
                    <a
                      className="elem-link nav-link active"
                      data-bs-toggle="tab"
                      href="#description"
                    >
                      Опис
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="elem-link nav-link"
                      data-bs-toggle="tab"
                      href="#chapters"
                      onClick={fetchChapters}
                    >
                      Розділи
                    </a>
                  </li>
                </ul>

                {/* <!-- Tab panes --> */}
                <div className="tab-content text-break pt-2">
                  <div className="tab-pane container active" id="description">
                    {/* Book description */}
                    <div id="description-content" className="book-description">
                      {book.description}
                    </div>
                    <button
                      id="btn-collaps"
                      className="button-collapse"
                      onClick={collapse}
                    >
                      Детальніше
                    </button>
                  </div>
                  <div
                    className="tab-pane container chapters text-truncate"
                    id="chapters"
                  >
                    {chapters.length > 0 &&
                      chapters.map((c, i) => (
                        <a
                          key={c.id}
                          className="elem-link chapter"
                          href={`/book/${id}/ch/${c.chapterNumber}`}
                        >
                          {i + 1 + '. ' + c.title}
                        </a>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="background-color my-5 py-2">
        <div className="container container-small">
          <CommentsList comments={comments} createComment={createComment} />
        </div>
      </div>

      <div className="mt-4">
        <Footer />
      </div>
    </>
  )
}
