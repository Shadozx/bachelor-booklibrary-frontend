import UserNav from '../../../fragments/navs/UserNav'

import { useNavigate } from 'react-router-dom'
import useInput from '../../../hooks/useInput'

import AuthService from '../../../../api/service/AuthService'
import { useEffect, useState } from 'react'
import { createErrorToast, createSuccessToast } from '../../../util/toast'

export default function LoginPage() {
  const username = useInput()
  const password = useInput()

  const [isUsernameEmpty, setIsUsernameEmpty] = useState(false)
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(false)

  const navigateTo = useNavigate()

  const authService = new AuthService()

  async function login() {
    if (!username.value.trim()) {
      setIsUsernameEmpty(true)
    }

    if (!password.value.trim()) {
      setIsPasswordEmpty(true)
    }

    if (!username.value.trim() || !password.value.trim()) {
      createErrorToast('Нікнейм та пароль не можуть бути порожніми')

      return
    }

    try {
      const response = await authService.login(username.value, password.value)

      if (response) {
        console.log('success')
        console.log(response)
        createSuccessToast('Ви війшли в систему')
        navigateTo('/')
      } else {
        createErrorToast('Сталася помилка')
      }
    } catch (e) {
      console.log('error login')
      createErrorToast(e.message)
    }
  }

  return (
    <>
      <UserNav />
      <div
        className="container-sm p-0 mt-5"
        style={{ maxWidth: '440px', width: '100%' }}
      >
        <div className="background-color border-radius p-3">
          <div className="p-3">
            <div className="mb-3">
              <label htmlFor="username" className="col-form-label">
                Нікнейм:
              </label>

              <div className="input-group">
                <div className="input-group-prepend">
                  <span
                    className="input-group-text color-text"
                    style={{ backgroundColor: 'transparent', border: 'none' }}
                  >
                    <i className="bi bi-person"></i>
                  </span>
                </div>
                <input
                  className="form-control color-text"
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Введіть нікнейм"
                  value={username.value}
                  onChange={username.onChange}
                  style={{
                    backgroundColor: 'transparent',
                    border: !isUsernameEmpty ? '' : '1px solid red',
                  }}
                />{' '}
              </div>
              {isUsernameEmpty && (
                <div style={{ color: 'red' }}>Нікнейм не може бути пустим</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="col-form-label">
                Пароль :
              </label>
              <div className="input-group">
                <div className="input-group-prepend">
                  <div
                    className="input-group-text color-text"
                    style={{ backgroundColor: 'transparent', border: 'none' }}
                  >
                    <i className="bi bi-lock"></i>
                  </div>
                </div>
                <input
                  className="form-control color-text"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Введіть пароль"
                  value={password.value}
                  onChange={password.onChange}
                  style={{
                    backgroundColor: 'transparent',
                    border: !isPasswordEmpty ? '' : '1px solid red',
                  }}
                />
              </div>
              {isPasswordEmpty && (
                <div style={{ color: 'red' }}>Пароль не може бути пустим</div>
              )}
            </div>

            <button
              className="btn btn-primary"
              onClick={login}
              style={{ width: '100%' }}
            >
              Увійти
            </button>

            <div className="mt-3">
              <p>
                Якщо у вас ще немає акаунту,{' '}
                <a href="/auth/registration">ви можете тут зареєструватися</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
