import axios from 'axios'
import env from '../../../env'
// import dotenv from 'dotenv'

// dotenv.config()

const BASE_URL = env.REACT_APP_BASE_URL
const API_BOOKS = env.API_BOOKS

export default class BookService {
  constructor(token) {
    this.token = token
  }

  async getBook(bookId) {
    return await axios.get(`${BASE_URL}/${API_BOOKS}/${bookId}`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async getBooks() {
    console.log('GET BOOKS:' + this.token)
    return await axios.get(`${BASE_URL}/${API_BOOKS}`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async getBooksWithFilters(
    searchText,
    fromAmount,
    toAmount,
    fromYear,
    toYear
  ) {
    return await axios.post(
      `${BASE_URL}/${API_BOOKS}/filter`,
      { searchText, fromAmount, toAmount, fromAmount, fromYear, toYear },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async reloadChapters(bookId) {
    return await axios.get(`${BASE_URL}/${API_BOOKS}/${bookId}/reload`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async deleteBook(bookId) {
    return await axios.delete(`${BASE_URL}/${API_BOOKS}/${bookId}`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async createBook(title, description, bookImage) {
    return await axios.post(
      `${BASE_URL}/${API_BOOKS}/new`,
      {
        title,
        description,
        bookImage,
      },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }
  getAuthorizationHeader() {
    return { Authorization: 'Bearer ' + this.token }
  }
}
