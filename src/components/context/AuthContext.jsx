import React, { createContext, useState, useContext } from 'react'
import AuthService from '../../api/service/AuthService'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const authService = new AuthService()
  const response = authService.getCurrentUser()

  let user
  if (!response) {
    user = null
  } else {
    user = response.data
  }

  const [isLoggedIn, setIsLoggedIn] = useState(user != null)
  const [role, setRole] = useState(user != null ? user.roleName : 'USER') // Роль за замовчуванням
  // Інші стани і методи для роботи з аутентифікацією

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
