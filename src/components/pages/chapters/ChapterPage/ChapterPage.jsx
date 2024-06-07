import { Await, useParams } from 'react-router-dom'

import { useEffect, useState } from 'react'
import ReadingNav from '../../../fragments/navs/ReadingNav'
import ChapterService from '../../../../api/service/ChapterService'
import BookService from '../../../../api/service/BookService'

import './ChapterPage.css'
import AuthService from '../../../../api/service/AuthService'
import AuthUser from '../../../context/AuthUser'
import BookMarkService from '../../../../api/service/BookMarkService'

import { createSuccessToast, createErrorToast } from '../../../util/toast'
import CommentsList from '../../../fragments/lists/comments/CommentsList'
import Footer from '../../../fragments/footers/Footer'
import CommentService from '../../../../api/service/CommentService'

export default function ChapterPage() {
  const { bookId, chapterNumber } = useParams()

  const [authUser, setAuthUser] = useState(new AuthUser())

  const [book, setBook] = useState({ title: '', id: 0 })
  const [chapter, setChapter] = useState({ title: '', id: 0, text: '' })
  const [chapters, setChapters] = useState([])
  const [bookMark, setBookMark] = useState(null)

  const [comments, setComments] = useState([])

  const [isLoading, setIsLoading] = useState(false)

  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())
  const chapterService = new ChapterService(authService.getToken())
  const bookMarkService = new BookMarkService(authService.getToken())
  const commentService = new CommentService(authService.getToken())

  useEffect(() => {
    async function fetchAuthUser() {
      setIsLoading(true)

      if (authUser.getUser() == null) {
        const user = await authService.getAuthUser()

        console.log('fetch authuser')

        setAuthUser(user)
      }
    }

    fetchAuthUser()
  }, [bookId, chapterNumber])

  useEffect(() => {
    async function fetchBook() {
      if (book.title == '') {
        const responseBook = bookService.getBook(bookId)

        console.log('fetch book')
        setBook((await responseBook).data)
      }
    }

    fetchBook()
  }, [authUser])

  useEffect(() => {
    async function fetchChapter() {
      if (chapter.title == '') {
        const responseChapter = chapterService.getChapter(bookId, chapterNumber)

        console.log('fetch chapter')

        setChapter((await responseChapter).data)
      }
    }

    fetchChapter()
  }, [book])

  useEffect(() => {
    async function fetchChapters() {
      if (chapters.length == 0) {
        const responseChapters = chapterService.getChaptersByBook(bookId)

        console.log('fetch chapters')

        setChapters((await responseChapters).data)
      }
    }

    fetchChapters()
  }, [chapter])

  useEffect(() => {
    async function fetchBookMark() {
      if (authUser.isAuthorized()) {
        console.log('fetch bookmark')

        try {
          const responseBookMark = bookMarkService.getBookMarkByOwnerAndBook(
            authUser.getUser().id,
            bookId
          )

          if ((await responseBookMark).status == 200) {
            setBookMark((await responseBookMark).data)
          }
        } catch (e) {
          console.log('Message:' + e)
        }
      }

      setIsLoading(false)
    }

    fetchBookMark()
  }, [chapters])

  useEffect(() => {
    async function fetchComments() {
      if (chapter && chapter?.id) {
        console.log('fetch comments')
        const response = await commentService.getChapterComments(chapter.id)

        if (response.status == 200) {
          setComments(response.data)
        }
      }
    }
    fetchComments()
  }, [chapter])

  useEffect(() => {
    const bookmark = document.getElementById('bookmark-paragraph')

    if (bookmark != null) {
      bookmark.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest',
      })
    }
  }, [bookMark])

  const bookUrl = `/book/${bookId}`

  const nextPage =
    chapterNumber < chapters.length
      ? `${bookUrl}/ch/${Number(chapterNumber) + 1}`
      : bookUrl
  const prevPage =
    chapterNumber > 1 ? `${bookUrl}/ch/${Number(chapterNumber) - 1}` : bookUrl

  if (isLoading) {
    return <div>Loading...</div>
  }

  async function updateBookMark(paragraph) {
    if (bookMark) {
      const response = await bookMarkService.updateBookMark(
        bookMark.id,
        bookMark.catalogId,
        chapter.id,
        paragraph
      )

      if (response.status == 200) {
        createSuccessToast('Закладка була оновлена')

        setTimeout(() => {
          window.location.reload()
        }, 4000)
      } else {
        createErrorToast('Сталася помилка при оновлені закладки')
      }

      console.log(response.status)
    }
  }

  async function createComment(text) {
    const response = await commentService.createChapterComment(
      authUser.getUser().id,
      chapter.id,
      text
    )

    if (response.status == 201) {
      createSuccessToast('Коментарій був доданий')
    } else {
      createErrorToast('Сталася помилка при додаванні коментарія')
    }
  }

  document.title = chapter.title

  return (
    <>
      <ReadingNav title={chapter.title} book={book} chapters={chapters} />
      <div className="container-sm container-small p-0 my-5">
        <div className="section-chapter">
          <div className="h2 section-chapter-name">{chapter.title}</div>
          <div className="section-chapter-body">
            {chapter.text?.split('\n').map((p, i) => (
              <>
                <div key={i} className="mb-2 d-flex justify-content-between">
                  <div dangerouslySetInnerHTML={{ __html: p }}></div>
                  {bookMark && (
                    <span
                      className="bookmark p-2"
                      onClick={() => updateBookMark(i + 1)}
                    >
                      <span className="bookmark_inner">
                        {bookMark &&
                        bookMark?.paragraph == i + 1 &&
                        bookMark.chapterId == chapter.id ? (
                          <i
                            id="bookmark-paragraph"
                            className="bi bi-bookmark-fill"
                          ></i>
                        ) : (
                          <i className="hide bi bi-bookmark"></i>
                        )}
                      </span>
                    </span>
                  )}
                </div>
              </>
            ))}
          </div>
        </div>

        {/* <!--         PC version arrows--> */}
        <div className="position-relative">
          <div className="arrow-left reader-arrow top-50 start-0 translate-middle-y">
            <a className="elem-link" id="keyLeft" href={prevPage}>
              <i className="bi bi-arrow-left"></i>
            </a>
          </div>
          <div className="arrow-right reader-arrow top-50 end-0 translate-middle-y">
            <a className="elem-link" id="keyRight" href={nextPage}>
              <i className="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>

        <div
          id="arrow-mobile"
          className="reader-arrow-mobile p-2 navigation position-fixed start-0 end-0  autohide-bottom"
        >
          <div className="d-flex align-items-center justify-content-between">
            <a
              className="btn btn-button"
              href={prevPage}
              style={{ width: '25%' }}
            >
              <i className="arrow-mobile bi bi-caret-left-square"></i>
            </a>
            <div
              data-bs-toggle="offcanvas"
              data-bs-target="#listChapters"
              aria-controls="listChapters"
              className="el-title text-truncate"
            >
              {chapter.title}
            </div>
            <a
              className="btn btn-button"
              href={nextPage}
              style={{ width: '25%' }}
            >
              <i className="arrow-mobile bi bi-caret-right-square"></i>
            </a>
          </div>
        </div>

        {/* <!--         Buttons for switch chapters of book and book button--> */}
        <div className="mt-4">
          <div className="d-flex m-2 justify-content-between ">
            {chapterNumber > 1 && (
              <a
                className="btn btn-button text-truncate"
                style={{ width: '40%' }}
                href={`${bookUrl}/ch/${Number(chapterNumber) - 1}`}
              >
                Назад
              </a>
            )}
            {chapterNumber < chapters.length && (
              <a
                className="btn btn-button text-truncate"
                style={{ width: '40%' }}
                href={`${bookUrl}/ch/${Number(chapterNumber) + 1}`}
              >
                Вперед
              </a>
            )}
          </div>

          {/* <!--    Book link--> */}
          <a
            className="btn btn-button text-truncate"
            style={{ width: '100%' }}
            href={bookUrl}
          >
            Книжка
          </a>
        </div>
      </div>

      <div className="background-color my-5 py-2">
        <div className="container container-small">
          <CommentsList
            comments={comments}
            createComment={createComment}
            // comments={[
            //   {
            //     id: 1,
            //     text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem nihil excepturi explicabo dolorum quos cupiditate labore natus dolorem numquam accusamus odio consequatur, quas tenetur! Officiis.',
            //     ownerId: 1,
            //     commentId: 1,
            //   },
            // ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <Footer />
      </div>
    </>
  )
}
