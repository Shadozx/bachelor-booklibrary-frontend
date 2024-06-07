import { useEffect, useState } from 'react'

import UserNav from '../../../fragments/navs/UserNav'
import BookService from '../../../../api/service/BookService'
import catalogStyles from './CatalogPage.module.css'
import useInput from '../../../hooks/useInput'
import AuthService from '../../../../api/service/AuthService'
import AuthUser from '../../../context/AuthUser'
import { createErrorToast, createSuccessToast } from '../../../util/toast'

export default function CatalogPage() {
  const [books, setBooks] = useState([])

  const filter = {
    searchText: useInput(null),

    fromAmount: useInput(0),
    toAmount: useInput(null),

    fromYear: useInput(0),
    toYear: useInput(null),
  }
  const [isLoading, setIsLoading] = useState(false)

  const [authUser, setAuthUser] = useState(new AuthUser())

  const authService = new AuthService()
  const bookService = new BookService(authService.getToken())

  useEffect(() => {
    setIsLoading(true)
    async function fetchAuthUser() {
      const user = await authService.getAuthUser()

      console.log('fetch')

      setAuthUser(user)
    }

    fetchAuthUser()
  }, [])

  useEffect(() => {
    async function fetchBooks() {
      const response = bookService.getBooks()
      setBooks((await response).data)
      setIsLoading(false)
    }
    fetchBooks()
  }, [authUser])

  async function fetchFilteredBooks() {
    const response = await bookService.getBooksWithFilters(
      filter.searchText.value,
      filter.fromAmount.value,
      filter.toAmount.value,
      filter.fromYear.value,
      filter.toYear.value
    )

    if (response.status == 200) {
      createSuccessToast('Фільтрація пройшла успішно')
      setBooks(response.data)
    } else {
      createErrorToast('Сталася помилка з фільтрацією книг')
    }
  }

  async function fetchBooks() {
    filter.searchText.setValue('')

    filter.fromAmount.setValue(0)
    filter.fromYear.setValue(0)

    filter.toAmount.setValue(null)
    filter.toYear.setValue(null)

    const response = await bookService.getBooks()

    if (response.status == 200) {
      createSuccessToast('Фільтрація пройшла успішно')
      setBooks(response.data)
    } else {
      createErrorToast('Сталася помилка з фільтрацією книг')
    }
  }

  document.title = 'Каталог книг'

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <UserNav user={authUser.getUser()} />
      <div className={`container ${catalogStyles.containerSmall} p-0 mt-5`}>
        <div
          className={`d-flex justify-content-center ${catalogStyles.booksContainer}`}
        >
          <div className={catalogStyles.books}>
            {books.map((book, index) => (
              <div key={index} className={catalogStyles.book}>
                <a
                  className={catalogStyles.mediaCard}
                  href={`/book/${book.id}`}
                  style={{ backgroundImage: `url(${book.bookImageUrl})` }}
                >
                  <div className={catalogStyles.nameBook}>
                    <h3>{book.title}</h3>
                  </div>
                </a>
              </div>
            ))}
          </div>
          <div
            className={`${catalogStyles.bookSearch} position-fixed top-50 end-0 translate-middle-y`}
          >
            <div className={`m-1 ${catalogStyles.searchFilters}`}>Фільтри</div>

            <div className="m-1">
              <input
                className={`form-control me-1 ${catalogStyles.formInput}`}
                type="text"
                placeholder="Пошук по назві"
                aria-label="Search"
                name="search-text"
                value={filter.searchText.value}
                onChange={filter.searchText.onChange}
              />
            </div>
            <div className="m-1">Кількість розділів</div>
            <div className="d-flex justify-content-center align-items-center m-1">
              <input
                className={`form-control me-1 ${catalogStyles.formInput}`}
                type="number"
                name="from-amount"
                placeholder="Від"
                min={0}
                value={filter.fromAmount.value}
                onChange={filter.fromAmount.onChange}
              />
              <div className="mx-2">—</div>
              <input
                className={`form-control me-1 ${catalogStyles.formInput}`}
                type="number"
                name="to-amount"
                placeholder="До"
                min={0}
                value={filter.toAmount.value}
                onChange={filter.toAmount.onChange}
              />
            </div>
            <div className="m-1">Рік добавлення</div>
            <div className="d-flex justify-content-center align-items-center m-1">
              <input
                className={`form-control me-1 ${catalogStyles.formInput}`}
                type="number"
                name="from-added-book-year"
                min={0}
                placeholder="Від"
                value={filter.fromYear.value}
                onChange={filter.fromYear.onChange}
              />
              <div className="mx-2">—</div>
              <input
                className={`form-control me-1 ${catalogStyles.formInput}`}
                type="number"
                name="to-added-book-year"
                min={0}
                placeholder="До"
                value={filter.toYear.value}
                onChange={filter.toYear.onChange}
              />
            </div>
            <button
              className="m-1 btn btn-primary"
              onClick={fetchFilteredBooks}
            >
              Виконати
            </button>
            <button className="btn btn-button" onClick={fetchBooks}>
              Скинути
            </button>
            {/* Решта фільтрів і кнопки тут */}
          </div>
        </div>
      </div>
    </>
  )
}
