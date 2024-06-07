import axios from 'axios'
import env from '../../../env'
// import dotenv from 'dotenv'

// dotenv.config()

const BASE_URL = env.REACT_APP_BASE_URL
const API_BOOKS = env.API_BOOKS

export default class BookMarkService {
  constructor(token) {
    this.token = token
  }

  async getBookMarks(catalogId) {
    return await axios.get(`${BASE_URL}/api/catalogs/${catalogId}/bookmarks`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async getBookMarkByOwnerAndBook(ownerId, bookId) {
    console.log(ownerId, bookId)

    const queryParams = `?bookId=${bookId}` // Формуємо рядок параметрів запиту

    return await axios.get(
      `${BASE_URL}/api/users/${ownerId}/bookmarks${queryParams}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )

    // console.log(this.token)
    // return axios.request({
    //   method: 'GET',
    //   maxBodyLength: Infinity,
    //   url: `${BASE_URL}/api/users/1/bookmarks${queryParams}`,
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Bearer ' + this.token,
    //   },
    //   data: requestData,
    // })
  }

  async createBookMark(catalogId, bookId) {
    return await axios.post(
      `${BASE_URL}/api/catalogs/${catalogId}/bookmarks`,
      { bookId },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async updateBookMark(markId, catalogId, chapterId, paragraph) {
    return await axios.put(
      `${BASE_URL}/api/catalogs/${catalogId}/bookmarks/${markId}`,
      { chapterId, paragraph },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async deleteBookMark(catalogId, markId) {
    return await axios.delete(
      `${BASE_URL}/api/catalogs/${catalogId}/bookmarks/${markId}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }
  getAuthorizationHeader() {
    return { Authorization: 'Bearer ' + this.token }
  }
}
