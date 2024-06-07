import axios from 'axios'
import env from '../../../env'
// import dotenv from 'dotenv'

// dotenv.config()

const BASE_URL = env.REACT_APP_BASE_URL
const API_USERS = env.API_USERS
const API_BOOKS = env.API_BOOKS
const API_COMMENTS = 'api/comments'

export default class CommentService {
  constructor(token) {
    this.token = token
  }

  async getBookComments(bookId) {
    return await axios.get(`${BASE_URL}/${API_COMMENTS}/books/${bookId}`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async getChapterComments(chapterId) {
    return await axios.get(
      `${BASE_URL}/${API_COMMENTS}/chapters/${chapterId}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async getComments() {
    return await axios.get(`${BASE_URL}/${API_COMMENTS}`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async deleteUserComment(userId, commentId) {
    return await axios.delete(
      `${BASE_URL}/${API_USERS}/${userId}/comments/${commentId}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async createBookComment(userId, bookId, text) {
    return await axios.post(
      `${BASE_URL}/${API_USERS}/${userId}/comments/books/${bookId}`,
      {
        text,
      },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async createChapterComment(userId, chapterId, text) {
    return await axios.post(
      `${BASE_URL}/${API_USERS}/${userId}/comments/chapters/${chapterId}`,
      {
        text,
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
