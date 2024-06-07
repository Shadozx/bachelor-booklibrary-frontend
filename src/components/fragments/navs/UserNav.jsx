import { useEffect, useState } from 'react'
import AuthService from '../../../api/service/AuthService'

export default function UserNav({ user }) {
  const authService = new AuthService()



  return (
    <>
      <div
        className="navigation offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="navbar-mobile"
        aria-labelledby="navbarMobile"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
            Меню
          </h5>
          <button
            type="button"
            className="btn-close text-reset color-text"
            data-bs-dismiss="offcanvas"
            aria-label="Закрити"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="container">
            {user != undefined && user != null ? (
              <>
                <div className="d-flex justify-content-between m-3">
                  <a className="btn btn-button m-2" href={`/user/${user?.id}`}>
                    Профіль
                  </a>

                  {['ADMIN', 'SUPER_ADMIN'].includes(user?.roleName) && (
                    <a className="btn btn-button m-2" href="/admin">
                      Адмін панель
                    </a>
                  )}

                  <button className="navigation-elem btn btn-button">
                    Вийти
                  </button>
                </div>
              </>
            ) : (
              <div className="dl-flex justify-content-between m-3">
                <a className="btn btn-button m-2" href="/auth/registration">
                  Реєстрація
                </a>
                <a className="btn m-2 navigation-elem" href="/auth/login">
                  Увійти
                </a>
              </div>
            )}

            <div className="my-3">
              <a className="nav-a fs-6" href="/">
                Головна сторінка
              </a>
              <a className="nav-a" href="/catalog">
                Каталог
              </a>
            </div>
          </div>
        </div>
      </div>

      <nav className="navigation navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navigation-elem navbar-brand" href="/">
            BookLibrary
          </a>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  className="navigation-elem nav-link active"
                  aria-current="page"
                  href="/"
                >
                  Головна сторінка
                </a>
              </li>
              <li className="nav-item">
                <a className="navigation-elem nav-link" href="/catalog">
                  Каталог
                </a>
              </li>
            </ul>
          </div>
          <div className="collapse navbar-collapse justify-content-end">
            <div
              onClick={() =>
                document.body.classList.contains('dark-theme')
                  ? document.body.classList.remove('dark-theme')
                  : document.body.classList.add('dark-theme')
              }
            >
              <i id="switcher-theme" className="bi bi-moon"></i>
            </div>

            {user !== undefined && user !== null ? (
              <ul className="navbar-nav navbar-right">
                <li className="nav-item">
                  <a href={`/user/${user.id}`} className="btn btn-button mx-2">
                    Профіль
                  </a>
                </li>

                {['ADMIN', 'SUPER_ADMIN'].includes(user?.roleName) && (
                  <li className="nav-item">
                    <a className="btn btn-button mx-2" href="/admin">
                      Адмін панель
                    </a>
                  </li>
                )}

                <li className="nav-item">
                  <button
                    className="navigation-elem btn btn-button"
                    type="submit"
                    onClick={() => {
                      authService.logout()
                      window.location.reload()
                    }}
                  >
                    Вийти
                  </button>
                </li>
              </ul>
            ) : (
              <ul className="navbar-nav navbar-right">
                <li className="nav-item">
                  <a href="/auth/registration" className="btn btn-button mx-2">
                    Реєстрація
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="/auth/login"
                    className="navigation-elem btn btn-button mx-2"
                  >
                    Увійти
                  </a>
                </li>
              </ul>
            )}
          </div>

          <button
            id="button-mobile"
            className="btn color-text"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#navbar-mobile"
            aria-controls="navbar-mobile"
          >
            <i className="navbar-item bi bi-list"></i>
          </button>
        </div>
      </nav>
    </>
  )
}
