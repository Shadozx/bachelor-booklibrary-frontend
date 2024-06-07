import React, { useEffect, useState } from 'react'
import { Route, Navigate, useNavigate, Outlet } from 'react-router-dom'
// import { useAuth } from './AuthContext'
import AuthUser from './AuthUser'
import AuthService from '../../api/service/AuthService'

export default function CheckerAuthorization({ roles }) {
  const [authUser, setAuthUser] = useState(new AuthUser())

  const nav = useNavigate()
  const authService = new AuthService()

  useEffect(() => {
    async function checkAuthorization() {
      const user = await authService.getAuthUser()

      // console.log('user is null? ' + user == null)
      // console.log(user)
      // console.log('User token:' + user?.token)
      console.log('check auth')
      if (user == null || !user.isAuthorized()) {
        nav('/auth/login')
      } else {
        setAuthUser(user)
      }
    }

    checkAuthorization()
  }, [])

  // return <Route {...rest} exact path={path} element={element} />

  return <Outlet />

  // return (
  //   <Route
  //     {...rest}
  //     element={
  //       user == null || !user.isAuthorized() &&
  //       roles.includes(authUser.getRole()) ? (
  //         element
  //       ) : (
  //         <Navigate to="/auth/login" />
  //       )
  //     }
  //   />
  // )
}
