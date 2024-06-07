import axios from 'axios'
import env from '../../../env'
// import dotenv from 'dotenv'

// dotenv.config()

const BASE_URL = env.REACT_APP_BASE_URL
const API_USERS = env.API_USERS

export default class CatalogService {
  constructor(token) {
    this.token = token
  }

  async getCatalogs(userId) {
    return await axios.get(`${BASE_URL}/${API_USERS}/${userId}/catalogs`, {
      headers: { Authorization: 'Bearer ' + this.token },
    })
  }

  async getCatalog(userId, catalogId) {
    return await axios.get(
      `${BASE_URL}/${API_USERS}/${userId}/catalogs/${catalogId}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async createCatalog(userId, title, isPulic) {
    return await axios.post(
      `${BASE_URL}/${API_USERS}/${userId}/catalogs`,
      {
        title,
        isPulic,
      },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async updateCatalog(userId, catalogId, title, isPulic) {
    return await axios.put(
      `${BASE_URL}/${API_USERS}/${userId}/catalogs/${catalogId}`,
      {
        title,
        isPulic,
      },
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  async deleteCatalog(userId, catalogId) {
    return await axios.delete(
      `${BASE_URL}/${API_USERS}/${userId}/catalogs/${catalogId}`,
      {
        headers: { Authorization: 'Bearer ' + this.token },
      }
    )
  }

  getAuthorizationHeader() {
    return { Authorization: 'Bearer ' + this.token }
  }
}
