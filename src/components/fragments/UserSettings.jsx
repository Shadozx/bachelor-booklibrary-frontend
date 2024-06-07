import { useCallback, useState } from 'react'
import userInfoStyles from '../../components/pages/users/UserInfoPage/UserInfoPage.module.css'

import useInput from '../hooks/useInput'

import PhotoDropzone from './dropzone/PhotoDropzone'

import AuthService from '../../api/service/AuthService'
import UserService from '../../api/service/UserService'

import { createSuccessToast, createErrorToast } from '../util/toast'

export default function UserSettings({ user }) {
  const authService = new AuthService()

  const username = useInput()
  const password = useInput()

  const [file, setFile] = useState(null)

  const userService = new UserService(authService.getToken())
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    const formData = new FormData()
    formData.append('file', file)

    setFile(formData)
  })

  async function saveImage() {
    const response = await userService.addUserImage(user.id, file)

    console.log(response)

    if (response.status == 200) {
      console.log('success')
      createSuccessToast('Фотографія була додана')
    } else {
      createErrorToast('Сталася помилка при добавленні фотографії')
    }
  }

  return (
    <>
      <div className="tab-pane" id="user-settings">
        {/* <!-- Налаштування користувача --> */}
        <div className="d-flex flex-wrap justify-content-between">
          <div
            className={`nav nav-tabs ${userInfoStyles.navTabs} ${userInfoStyles.navTabsVertical}`}
            id="settings"
            role="tablist"
          >
            <button
              className={`nav-link ${userInfoStyles.navLink} active`}
              data-bs-toggle="tab"
              data-bs-target="#user-info"
            >
              Інформація
            </button>
          </div>

          <div
            className={`${userInfoStyles.tabsContainer} tab-container tab-content`}
          >
            <div className="tab-pane active" id="user-info">
              <div
                className={`tab-setting border-radius text-truncate mb-2 ${userInfoStyles.tabSetting}`}
              >
                <div>
                  <div className="my-2">
                    <label>Фотографія користувача</label>
                    <div className="my-2 color-text">
                      <PhotoDropzone onDrop={onDrop} />
                    </div>

                    <button
                      className="my-2 color-text btn btn-button"
                      onClick={saveImage}
                    >
                      Зберегти зміни
                    </button>
                  </div>

                  <div className="my-5">
                    <div id="update-user" className="mb-2">
                      <label style={{ display: 'block' }} htmlFor="username">
                        Імя користувача
                      </label>
                      <input
                        className="my-2"
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Введіть новий нікнейм"
                        onChange={username.onChange}
                      />
                    </div>

                    <div className="mb-2">
                      <label style={{ display: 'block' }} htmlFor="password">
                        Пароль
                      </label>
                      <input
                        className="my-2"
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Введіть новий пароль"
                        onChange={password.onChange}
                      />
                    </div>
                    <button
                      id="update-button-user"
                      type="submit"
                      className="btn btn-button"
                    >
                      Зберегти зміни
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
