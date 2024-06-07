import { useEffect, useState } from 'react'
import AuthService from '../../../../api/service/AuthService'
import BookService from '../../../../api/service/BookService'
import ChapterService from '../../../../api/service/ChapterService'
import userInfoStyles from '../../../pages/users/UserInfoPage/UserInfoPage.module.css'
import BookMarkService from '../../../../api/service/BookMarkService'
import { createErrorToast, createSuccessToast } from '../../../util/toast'
import AuthUser from '../../../context/AuthUser'

/**
 *
 * @param {Array<{id, paragraph, bookId, chapterId, userId}>} bookmarks
 * @param {{id, title, isPublic}} catalog
 * @returns
 */
export default function BookMarkList({ bookmarks, catalog }) {
  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())
  const chapterService = new ChapterService(authService.getToken())
  const bookMarkService = new BookMarkService(authService.getToken())

  const [authUser, setAuthUser] = useState(new AuthUser())

  useEffect(() => {
    async function fetchAuthUser() {
      if (authUser.getUser() == null) {
        const user = await authService.getAuthUser()

        console.log('fetch authuser')

        setAuthUser(user)
      }
    }

    fetchAuthUser()
  }, [bookmarks, catalog])

  function BookMarkLine({ mark, ...rest }) {
    const [book, setBook] = useState(null)
    const [chapter, setChapter] = useState(null)

    useEffect(() => {
      async function fetchBook() {
        const response = await bookService.getBook(mark.bookId)

        if (response.status == 200) {
          setBook(response.data)
        }
      }

      fetchBook()
    }, [mark.bookId])

    useEffect(() => {
      async function fetchChapter() {
        if (mark.chapterId) {
          const response = await chapterService.getChapterById(
            mark.bookId,
            mark.chapterId
          )

          if (response.status == 200) {
            setChapter(response.data)
          }
        }
      }

      fetchChapter()
    }, [book, mark.chapterId])

    async function deleteBookMark(catalog, mark) {
      const response = await bookMarkService.deleteBookMark(catalog, mark)

      if (response.status == 200) {
        createSuccessToast('Закладка була видалена')
      } else {
        createErrorToast('Сталася помилка з видалення закладки')
      }
    }

    return (
      <>
        {book && (
          <div
            key={mark.id}
            className={`tab border-radius text-truncate mb-2 ${userInfoStyles.tab}`}
          >
            {book?.bookImageUrl && (
              <img
                src={book.bookImageUrl}
                alt="фото книги"
                style={{ maxWidth: '100px' }}
              />
            )}
            <div
              className={`tab-inner text-truncate ${userInfoStyles.tabInner}`}
            >
              <div className="d-flex flex-column text-truncate p-2">
                <a
                  className="elem-link text-truncate"
                  href={`/book/${mark.bookId}`}
                >
                  {book.title}
                </a>

                {/* <!--                    chapter link --> */}
                {chapter ? (
                  <a
                    className="elem-link"
                    href={`/book/${mark.bookId}/ch/${chapter?.chapterNumber}`}
                  >
                    {chapter?.title}
                  </a>
                ) : (
                  <a className="elem-link" href={`/book/${mark.bookId}/ch/1`}>
                    Перший розділ
                  </a>
                )}
              </div>

              {mark?.ownerId == authUser.getUser()?.id && (
                <div className="group-buttons">
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => deleteBookMark(mark.catalogId, mark.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {bookmarks.length > 0 ? (
        bookmarks.map((mark, i) => <BookMarkLine mark={mark} />)
      ) : (
        <div
          className={`tab border-radius text-truncate mb-2 ${userInfoStyles.tab}`}
        >
          Поки тут немає ні однієї закладки
        </div>
      )}
    </>
  )
}
