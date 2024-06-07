import { useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'

import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

import UserNav from '../../../fragments/navs/UserNav'
import BookService from '../../../../api/service/BookService'
import ChapterService from '../../../../api/service/ChapterService'
import useInput from '../../../hooks/useInput'
import AuthService from '../../../../api/service/AuthService'
import AuthUser from '../../../context/AuthUser'

export default function EditChapterPage() {
  function useEdit(defaultValue = '') {
    const [value, setValue] = useState(defaultValue)

    return { value, setValue, onChange: (html) => setValue(html) }
  }

  const { bookId, chapterNumber } = useParams()

  const quillContainerRef = useRef(null)
  const quillRef = useRef(null)

  useEffect(() => {
    if (quillContainerRef.current && !quillRef.current) {
      quillRef.current = quillContainerRef.current.querySelector('.ql-editor')
    }
  }, [quillContainerRef])

  const [book, setBook] = useState({ id: 0, title: 0 })
  const [chapter, setChapter] = useState({
    id: 0,
    title: '',
    text: '',
    bookId: 0,
    chapterNumber: 0,
  })

  const title = useInput()
  const text = useEdit()

  const [isLoading, setIsLoading] = useState(false)

  const [authUser, setAuthUser] = useState(new AuthUser())

  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())
  const chapterService = new ChapterService(authService.getToken())

  async function buildPage() {
    setIsLoading(true)

    const user = await authService.getAuthUser()

    console.log('fetch')

    setAuthUser(user)

    const responseBook = await bookService.getBook(bookId)
    setBook(responseBook.data)

    const responseChapter = await chapterService.getChapter(
      bookId,
      chapterNumber
    )
    setChapter(responseChapter.data)

    title.setValue(responseChapter.data.title)
    text.setValue(responseChapter.data.text)

    setIsLoading(false)
  }

  useEffect(() => {
    buildPage()
  }, [bookId, chapterNumber])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <UserNav user={{ id: 1 }} />
      <div className="container container-small p-0 my-4">
        <div className="my-2">
          <p>
            <a className="elem-link" href="/admin/">
              Адмін панель{' '}
            </a>
            /
            <a
              className="elem-link"
              href={`/admin/book/${bookId}/edit`}
              th:text="${' ' + book.title + ' '}"
            >{` ${book.title} `}</a>
            /
            <a
              className="elem-link"
              href={`/admin/book/${book.id}/chapter/${chapter.chapterNumber}`}
            >
              Редагувати главу
            </a>
          </p>
        </div>

        <div className="background-color border-radius p-4">
          <div className="mb-3">
            <div className="my-2">
              <label htmlFor="chapter-name">Назва глави:</label>
              <textarea
                name="chapter-name"
                id="chapter-name"
                className="form-control textarea"
                placeholder="Впишіть назву глави"
                value={title.value}
                onChange={title.onChange}
              ></textarea>
            </div>

            {/* <div className="my-2">
              <label htmlFor="content">Вміст глави:</label>
              <textarea
                type="text"
                className="form-control textarea chapter-content"
                name="content"
                id="content"
                placeholder="Впишіть вміст глави"
                autoComplete="off"
                value={text.value}
                onChange={text.onChange}
              ></textarea>
            </div> */}

            <div className="my-2">
              <ReactQuill
                theme="snow"
                value={text.value || ''}
                ref={quillRef}
                onChange={text.onChange}
              />
            </div>

            <div className="my-2">
              <label htmlFor="numberOfChapter">Виберіть яка це глава:</label>
              <select
                id="numberOfChapter"
                className="select form-select form-select-sm"
                aria-label=".form-select-sm example"
              >
                {Array.from({ length: book.amount }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <button className="btn btn-button">Оновити</button>
            <button className="btn btn-danger">Видалити</button>
          </div>
        </div>
      </div>
    </>
  )
}
