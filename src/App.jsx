import React, { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'

// import './App.css'
import MainRoutes from './components/routes/MainRoutes'
import BookRoutes from './components/routes/BookRoutes'
import CatalogRoutes from './components/routes/CatalogRoutes'
import UserRoutes from './components/routes/UserRoutes'
import AdminRoutes from './components/routes/AdminRoutes'
import AuthRoutes from './components/routes/AuthRoutes'
import AuthService from './api/service/AuthService'
import PrivateRoute from './components/context/CheckerAuthorization'
import CheckerAuthorization from './components/context/CheckerAuthorization'
import { ToastContainer } from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  function NotFound() {
    return <div>Такої сторінки не існує</div>
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* <PrivateRoute path="/" element={<MainRoutes />} /> */}
          {/* <Route path="/*" element={<MainRoutes />} /> */}

          {/* <PrivateRoute path="/catalog" element={<CatalogRoutes />} /> */}
          {/* <Route path="/catalog" element={<CatalogRoutes />} /> */}

          {/* <PrivateRoute path="/book/*" element={<BookRoutes />} /> */}
          {/* <Route path="/book/*" element={<BookRoutes />} /> */}

          {/* <PrivateRoute path="/user/*" element={<UserRoutes />} /> */}
          {/* <Route path="/user/*" element={<UserRoutes />} /> */}

          {/* <PrivateRoute
            path="/admin/*"
            roles={['ADMIN', 'SUPER_ADMIN']}
            element={<AdminRoutes />}
          /> */}

          {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}

          <Route
            element={<CheckerAuthorization />}
            roles={['ADMIN', 'SUPER_ADMIN']}
          >
            <Route path="/admin/*" element={<AdminRoutes />}></Route>
          </Route>

          <Route element={<CheckerAuthorization />}>
            <Route path="/*" element={<MainRoutes />}></Route>
          </Route>

          <Route element={<CheckerAuthorization />}>
            <Route path="/catalog/*" element={<CatalogRoutes />}></Route>
          </Route>

          <Route element={<CheckerAuthorization />}>
            <Route path="/book/*" element={<BookRoutes />}></Route>
          </Route>

          <Route element={<CheckerAuthorization />}>
            <Route path="/user/*" element={<UserRoutes />}></Route>
          </Route>

          <Route path="/auth/*" element={<AuthRoutes />} />

          <Route path="*" element={<NotFound />} />

          {/* <Route path="/main/*" element={<MainRoute />} /> */}
          {/* <Route path="/admin/*" element={<AdminRoutes />} /> */}
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}
