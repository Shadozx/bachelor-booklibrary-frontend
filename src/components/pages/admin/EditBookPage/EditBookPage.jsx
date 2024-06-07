import { useParams } from 'react-router-dom'
import BookService from '../../../../api/service/BookService'
import ChapterService from '../../../../api/service/ChapterService'
import { useEffect, useState } from 'react'
import UserNav from '../../../fragments/navs/UserNav'
import useInput from '../../../hooks/useInput'
import AuthService from '../../../../api/service/AuthService'
import AuthUser from '../../../context/AuthUser'
import PhotoDropzone from '../../../fragments/dropzone/PhotoDropzone'

export default function EditBookPage() {
  const { bookId } = useParams()

  const [book, setBook] = useState({
    id: 0,
    title: '',
    description: '',
    amount: 0,
    bookImageUrl: null,
    uploadedUrl: null,
  })
  const [chapters, setChapters] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const bookUrl = useInput()
  const bookName = useInput()
  const bookDescription = useInput()

  const [authUser, setAuthUser] = useState(new AuthUser())

  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())
  const chapterService = new ChapterService(authService.getToken())

  console.log(bookName)

  async function buildPage() {
    setIsLoading(true)

    const user = await authService.getAuthUser()

    console.log('fetch')

    setAuthUser(user)

    const responseBook = bookService.getBook(bookId)

    const bookData = (await responseBook).data
    setBook(bookData)

    bookName.setValue(bookData.title)
    bookDescription.setValue(bookData.description)

    const responseChapters = chapterService.getChaptersByBook(bookId)

    setChapters((await responseChapters).data)

    setIsLoading(false)
  }

  async function reloadChapters() {
    if (book?.id) {
      const response = bookService.reloadChapters(book.id)

      const status = (await response).status
      if (status == 200) {
        console.log('success reloading chapters')
      } else {
        console.log('error status: ' + status)
      }
    } else {
      console.log('id is null')
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
  }, [bookId])

  useEffect(() => {
    async function fetchBook() {
      const responseBook = bookService.getBook(bookId)

      const bookData = (await responseBook).data
      setBook(bookData)

      bookName.setValue(bookData.title)
      bookDescription.setValue(bookData.description)
    }

    fetchBook()
  }, [authUser])

  useEffect(() => {
    async function fetchChapters() {
      if (chapters.length == 0) {
        const responseChapters = chapterService.getChaptersByBook(bookId)

        setChapters((await responseChapters).data)

        setIsLoading(false)
      }
    }

    fetchChapters()
  }, [book])
  // useEffect(() => {
  //   buildPage()
  // }, [])

  function resizeTextarea(event) {
    event.target.style.height = 'auto'
    event.target.style.height = event.target.scrollHeight + 'px'
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  document.title = `Редагування книги: ${book.title}`

  return (
    <>
      <UserNav user={authUser.getUser()} />
      <div className="container container-small p-0 my-4">
        <div className="my-2">
          <p>
            <a className="elem-link" href="/admin/">
              Адмін панель{' '}
            </a>
            /
            <a
              className="elem-link"
              href={`/admin/book/${book.id}/edit`}
            >{` Редагувати книжку: ${book.title}`}</a>
          </p>
        </div>
        <div className="background-color border-radius p-4">
          <div className="mb-3">
            <div className="my-2">
              <label>Фотографія книжки</label>
              <div className="my-2 color-text">
                <PhotoDropzone />
              </div>
            </div>
            <div className="my-2">
              <label htmlFor="book-name">Назва книжки</label>
              <input
                className="form-control"
                type="text"
                name="book-name"
                id="book-name"
                placeholder="Впишіть назву книжки"
                value={bookName.value}
                onChange={bookName.onChange}
              />
            </div>
            <div className="my-2">
              <label htmlFor="book-description">Опис:</label>
              <textarea
                className="form-control textarea"
                name="book-description"
                id="book-description"
                placeholder="Впишіть опис книжки"
                value={bookDescription.value}
                onChange={bookDescription.onChange}
                onInput={(event) => {
                  event.target.style.height = 'auto'
                  event.target.style.height = event.target.scrollHeight + 'px'
                }}
              ></textarea>
            </div>
            <button className="btn btn-button">Оновити</button>
            <button className="btn btn-danger mx-2">Видалити</button>
          </div>
          {/* {book?.uploadedUrl && (
            <div className="my-3">
              <button
                className="btn btn-button"
                onClick={() => reloadChapters()}
              >
                Перегрузити розділи
              </button>
            </div>
          )} */}
          <div className="my-3">
            <a
              className="btn btn-button"
              href={`/admin/book/${book.id}/chapter/create`}
            >
              Додати новий розділ
            </a>
          </div>
          <div className="mt-2">
            {chapters &&
              chapters.length > 0 &&
              chapters.map((c, i) => (
                <div
                  className="chapter my-2 d-flex align-items-center justify-content-between"
                  style={{ borderBottom: '3px solid var(--border-color)' }}
                  key={c.id}
                >
                  <a
                    className="text-truncate elem-link"
                    href={`/book/${book.id}/ch/${c.chapterNumber}`}
                  >
                    {c.title}
                  </a>
                  <div
                    className="group-buttons p-2"
                    style={{
                      maxWidth: '120px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <a
                      className="btn btn-button mx-1"
                      href={`/admin/book/${book.id}/chapter/${c.chapterNumber}/edit`}
                    >
                      <i className="bi bi-pencil-fill"></i>
                    </a>
                    <button className="btn btn-danger mx-1">
                      <span className="bi bi-trash-fill"></span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
