export default class AuthUser {
  constructor(user = null, token = null) {
    this.user = user
    this.token = token
  }

  isAuthorized() {
    return this.getUser() != null
  }

  getRole() {
    return this.user?.roleName ? this.user?.roleName : null
  }

  isUser() {
    return this.getRole() == 'USER'
  }

  isAdmin() {
    return this.getRole() == 'ADMIN'
  }

  isSUPERADMIN() {
    return this.getRole() == 'SUPER_ADMIN'
  }

  getUser() {
    return this.user ? this.user : null
  }

  getToken() {
    return this.token ? this.token : null
  }
}
