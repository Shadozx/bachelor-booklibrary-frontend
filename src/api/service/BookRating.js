import axios from 'axios'
import env from '../../../env'
// import dotenv from 'dotenv'

// dotenv.config()

const BASE_URL = env.REACT_APP_BASE_URL
const API_BOOKS = env.API_BOOKS

export default class BookRatingService {
  constructor(token) {
    this.token = token
  }

  async getBookRatings(userId) {
    return await axios.get(`${BASE_URL}/api/users/${userId}/ratings`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async getBookRatingByOwnerAndBook(ownerId, bookId) {
    console.log(ownerId, bookId)

    const queryParams = `?bookId=${bookId}` // Формуємо рядок параметрів запиту

    console.log(`${BASE_URL}/api/users/${ownerId}/ratings${queryParams}`)
    return await axios.get(
      `${BASE_URL}/api/users/${ownerId}/ratings${queryParams}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async createBookRating(userId, bookId, rating) {
    console.log(userId, bookId, rating)
    return await axios.post(
      `${BASE_URL}/api/users/${userId}/ratings`,
      { bookId, rating },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async updateBookRating(userId, markId, rating) {
    return await axios.put(
      `${BASE_URL}/api/users/${userId}/ratings/${markId}`,
      { rating },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async deleteBookRating(userId, markId) {
    return await axios.delete(
      `${BASE_URL}/api/users/${userId}/ratings/${markId}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  getAuthorizationHeader() {
    return { Authorization: 'Bearer ' + this.token }
  }
}
