import axios from 'axios'
import env from '../../../env'
// import dotenv from 'dotenv'

// dotenv.config()

const BASE_URL = env.REACT_APP_BASE_URL
const API_BOOKS = env.API_BOOKS

export default class ChapterService {
  //   constructor(header, token) {
  //     this.header = header
  //     this.token = token
  //   }

  constructor(token) {
    this.token = token
  }

  async getChapter(bookId, chapterNumber) {
    return await axios.get(
      `${BASE_URL}/${API_BOOKS}/${bookId}/chapters/number/${chapterNumber}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async getChapterById(bookId, chapterId) {
    return await axios.get(
      `${BASE_URL}/${API_BOOKS}/${bookId}/chapters/${chapterId}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async getChaptersByBook(bookId) {
    return await axios.get(`${BASE_URL}/${API_BOOKS}/${bookId}/chapters`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  getAuthorizationHeader() {
    return { Authorization: 'Bearer ' + this.token }
  }
}
