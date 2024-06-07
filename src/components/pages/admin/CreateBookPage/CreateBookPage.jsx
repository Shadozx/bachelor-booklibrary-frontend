import { useNavigate, useParams } from 'react-router-dom'
import BookService from '../../../../api/service/BookService'
import ChapterService from '../../../../api/service/ChapterService'
import { useCallback, useEffect, useState } from 'react'
import UserNav from '../../../fragments/navs/UserNav'
import useInput from '../../../hooks/useInput'
import AuthService from '../../../../api/service/AuthService'
import AuthUser from '../../../context/AuthUser'
import { createErrorToast, createSuccessToast } from '../../../util/toast'
import PhotoDropzone from '../../../fragments/dropzone/PhotoDropzone'

export default function CreateBookPage() {
  const [chapters, setChapters] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const bookUrl = useInput()
  const bookName = useInput()
  const bookDescription = useInput()

  const [authUser, setAuthUser] = useState(new AuthUser())

  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())

  const navigateTo = useNavigate()
  console.log(bookName)

  useEffect(() => {
    async function fetchAuthUser() {
      setIsLoading(true)
      const user = await authService.getAuthUser()

      if (!user.isAuthorized()) {
        navigateTo('/auth/login')
      } else {
        console.log('fetch')

        setAuthUser(user)

        setIsLoading(false)
      }
    }

    fetchAuthUser()
  }, [])

  function resizeTextarea(event) {
    event.target.style.height = 'auto'
    event.target.style.height = event.target.scrollHeight + 'px'
  }

  async function createBook() {
    const response = await bookService.createBook(
      bookName.value,
      bookDescription.value,
      bookUrl.value
    )

    if (response.status == 200) {
      createSuccessToast('Книга була додана')
    } else {
      createErrorToast('Сталася помилка при добавленні книги')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  // const onDrop = useCallback((acceptedFiles) => {
  //   // const file = acceptedFiles[0]
  //   // const formData = new FormData()
  //   // formData.append('file', file)
  //   // setFile(formData)
  // })

  document.title = `Створення книги`

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
              href={`/admin/book/create`}
            >{` Створити нову книгу`}</a>
          </p>
        </div>
        <div className="background-color border-radius p-4">
          <div className="mb-3">
            <div className="my-2">
              <label>Фотографія книжки</label>
              <div className="my-2 color-text">
                <PhotoDropzone />
              </div>

              {/*<input
                className="form-control"
                type="url"
                name="book-image"
                id="book-image"
                placeholder="Впишіть силку на фотографію книжки"
                {...bookUrl}
  />*/}
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
            <button className="btn btn-primary" onClick={createBook}>
              Додати
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
