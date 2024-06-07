import axios from 'axios'
import env from '../../../env'
// import dotenv from 'dotenv'

// dotenv.config()

const BASE_URL = env.REACT_APP_BASE_URL
const API_USERS = env.API_USERS

export default class UserService {
  constructor(token) {
    this.token = token
  }
  async getUser(userId) {
    return await axios.get(`${BASE_URL}/${API_USERS}/${userId}`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async getUsers() {
    return await axios.get(`${BASE_URL}/${API_USERS}`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async getCatalogs(userId) {
    return await axios.get(`${BASE_URL}/${API_USERS}/${userId}/catalogs`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }
  async getCurrentUser() {
    return await axios.get(`${BASE_URL}/${API_USERS}/me`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async addUserImage(userId, formData) {
    return await axios.post(
      `${BASE_URL}/${API_USERS}/${userId}/images`,
      formData,
      { headers: { Authorization: 'Bearer ' + this.token } }
    )
  }
  //   static apiUsers = '/api/users'

  //   constructor(header, token) {
  //     this.header = header
  //     this.token = token
  //   }

  //   async createUser(unm, pass) {
  //     return fetch(UserService.apiUsers + '/', {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         [this.header]: this.token,
  //       },
  //       method: 'POST',
  //       body: JSON.stringify({ username: unm, password: pass }),
  //     })
  //   }

  //   async updateUser(unm, pass) {
  //     return fetch(UserService.apiUsers + '/', {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         [this.header]: this.token,
  //       },
  //       method: 'PUT',
  //       body: JSON.stringify({ username: unm, password: pass }),
  //     })
  //   }

  //   async updateUser(unm, pass, uR, id) {
  //     return fetch(UserService.apiUsers + '/' + id, {
  //       headers: {
  //         'Content-Type': 'application/json',
  //         [this.header]: this.token,
  //       },
  //       method: 'PUT',
  //       body: JSON.stringify({ username: unm, password: pass, role: uR }),
  //     })
  //   }

  //   async deleteUser(i) {
  //     return fetch(UserService.apiUsers + '/' + i, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         [this.header]: this.token, // Додавання CSRF-токену до заголовків
  //       },
  //     })
  //   }

  getAuthorizationHeader() {
    return { Authorization: 'Bearer ' + this.token }
  }
}
