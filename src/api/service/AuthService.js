import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

import env from '../../../env'
import UserService from './UserService'
import AuthUser from '../../components/context/AuthUser'

const BASE_URL = env.REACT_APP_BASE_URL

export default class AuthService {
  userTokenKey = 'book-library-user-token'

  async login(username, password) {
    // try {

    console.log(username, password)
    try {
      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        {
          username,
          password,
        },
        {
          Accept: 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        }
      )

      if (response) {
        const token = response.data?.token

        console.log('Saved token')
        if (token) {
          localStorage.setItem(this.userTokenKey, token)
        }

        return response.data
      }
    } catch (e) {
      // console.log(apiRes.data)
      console.log('here')

      console.log(e.response)
      const message = e.response.data.message
      throw new Error(message ? message : 'Сталася якась помилка')
    }
    // } catch (error) {
    //   console.error('Login error:', error)
    //   throw error
    // }
  }

  logout() {
    localStorage.removeItem(this.userTokenKey)
  }

  async register(username, password) {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/registration`, {
        username,
        password,
      })

      console.log('Registered: ' + response.status)

      return response.data
    } catch (error) {
      const message = error.response.data?.message
      throw new Error(message ? message : 'Сталася помилка')
    }
  }

  getToken() {
    const token = localStorage.getItem(this.userTokenKey)

    if (token) {
      return token
    } else {
      return null
    }
  }
  async getAuthUser() {
    const token = this.getToken()

    // console.log('token:' + token)
    if (!token) {
      return null
    }

    try {
      const decodedToken = jwtDecode(token)
      if (!decodedToken || !decodedToken.sub) {
        throw new Error('Invalid token data')
      }

      const userService = new UserService(token)
      const response = await userService.getCurrentUser()

      // console.log(response)
      if (response.status === 200) {
        console.log('fetch auth user')
        const user = response.data

        // console.log(user)
        return new AuthUser(user, token)
      } else {
        this.logout()
        throw new Error('Failed to fetch user data')
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      this.logout()
      return null
    }
  }
}
