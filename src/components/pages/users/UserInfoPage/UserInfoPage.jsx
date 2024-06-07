import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import UserService from '../../../../api/service/UserService'
import CatalogService from '../../../../api/service/CatalogService'
import BookMarkService from '../../../../api/service/BookMarkService'
import UserNav from '../../../fragments/navs/UserNav'
import userInfoStyles from './UserInfoPage.module.css'
import BookMarkList from '../../../fragments/lists/bookmarks/BookMarkList'
import UserSettings from '../../../fragments/UserSettings'
import AuthService from '../../../../api/service/AuthService'
import AuthUser from '../../../context/AuthUser'
import useInput from '../../../hooks/useInput'

import { createSuccessToast, createErrorToast } from '../../../util/toast'
import EditCatalogModal from '../../../fragments/modals/EditCatalogModal'
// import EditCatalogModal from '../../../fragments/modals/EditCatalogModal'

export default function UserInfoPage() {
  const { userId } = useParams()
  const [user, setUser] = useState({ id: 0, username: '', userImageUrl: '' })

  const [userCatalogs, setUserCatalogs] = useState([])
  const [markCatalogs, setMarkCatalogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [selectedCatalog, setSelectedCatalog] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const newCatalog = {
    title: useInput(''),
    isPublic: useInput(true),
  }
  const [authUser, setAuthUser] = useState(new AuthUser())

  const authService = new AuthService()
  const userService = new UserService(authService.getToken())
  const catalogService = new CatalogService(authService.getToken())
  const bookMarkService = new BookMarkService(authService.getToken())

  useEffect(() => {
    setIsLoading(true)
    async function fetchAuthUser() {
      setIsLoading(true)
      const user = await authService.getAuthUser()

      console.log('fetch')

      setAuthUser(user)
    }

    fetchAuthUser()
  }, [userId])

  useEffect(() => {
    async function fetchUser() {
      const responseUser = userService.getUser(userId)
      setUser((await responseUser).data)
    }

    fetchUser()
  }, [authUser])

  useEffect(() => {
    async function fetchUserCatalogs() {
      const responseCatalogs = catalogService.getCatalogs(userId)
      setUserCatalogs((await responseCatalogs).data)
      setIsLoading(false)
    }

    fetchUserCatalogs()
  }, [user])

  useEffect(() => {
    async function loadBookmarks() {
      setIsLoading(true)
      const all = []

      for (let c of userCatalogs) {
        const responseMarks = bookMarkService.getBookMarks(c.id)
        const marks = (await responseMarks).data
        c.bookmarks = marks
        all.push({ id: c.id, marks: [...marks] })
      }
      setMarkCatalogs(all)
      setIsLoading(false)
    }

    if (userCatalogs.length > 0) {
      loadBookmarks()
    }
  }, [userCatalogs])

  async function saveNewCatalog() {
    const response = await catalogService.createCatalog(
      userId,
      newCatalog.title.value,
      newCatalog.isPublic.value
    )

    if (response.status == 200) {
      console.log('success new catalog')
      createSuccessToast('Каталог був доданий')
    } else {
      createErrorToast('Сталася помилка при добавленні каталога')
    }
  }

  async function deleteCatalog(catalogId) {
    const id = authUser.getUser().id
    console.log(id, catalogId)
    const response = await catalogService.deleteCatalog(
      authUser.getUser().id,
      catalogId
    )

    if (response.status == 200) {
      console.log('success delete catalog')
      createSuccessToast('Каталог був видалений')
    } else {
      createErrorToast('Сталася помилка при видаленні каталога')
    }
  }

  const handleEditClick = (catalog) => {
    setSelectedCatalog(catalog)
    setShowModal(true)
  }

  const handleSave = async (updatedCatalog) => {
    const response = await catalogService.updateCatalog(
      authUser.getUser().id,
      updatedCatalog.id,
      updatedCatalog.title,
      updatedCatalog.isPublic
    )
    if (response.status === 200) {
      createSuccessToast('Каталог був оновлений')
    } else {
      createErrorToast('Сталася помилка при оновленні каталога')
    }
    setShowModal(false)
  }

  document.title = 'Профіль ' + user.username

  // console.log(newCatalog)

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <UserNav user={authUser.getUser()} />
      <div className="container container-small p-0 mt-5">
        <div className={userInfoStyles.userInfo}>
          <div className="p-3">
            {user?.userImageUrl && (
              <img
                src={user.userImageUrl}
                className={userInfoStyles.avatar}
                alt="Фото користувача"
              />
            )}
            <div className="h6 p-2">{user?.username}</div>
            {user?.roleName == 'ADMIN' && (
              <div className="h6 p-2" style={{ color: 'red' }}>
                адміністратор
              </div>
            )}
            {user?.roleName == 'SUPER_ADMIN' && (
              <div className="h6 p-2" style={{ color: '#5353c5' }}>
                супер адміністратор
              </div>
            )}
          </div>
          <div className="px-3 border-radius">
            <div
              className={`nav-tabs-horizontal nav nav-tabs ${userInfoStyles.navTabs}`}
              role="tablist"
            >
              <button
                className={`nav-link active ${userInfoStyles.navLink}`}
                data-bs-toggle="tab"
                data-bs-target="#user-catalogs"
              >
                Каталоги
              </button>
              {user.id == authUser.getUser()?.id && (
                <button
                  className={`nav-link ${userInfoStyles.navLink}`}
                  data-bs-toggle="tab"
                  data-bs-target="#user-settings"
                >
                  Налаштування
                </button>
              )}
            </div>
          </div>
        </div>

        {/* <!-- Tab panes --> */}
        <div className="mt-3 tab-content pt-2">
          {/* <!-- Каталоги користувача --> */}
          <div className="tab-pane active" id="user-catalogs">
            <div className={`tabs ${userInfoStyles.tabs}`}>
              <div
                className={`nav nav-tabs ${userInfoStyles.navTabs} ${userInfoStyles.navTabsVertical}`}
                id="book-catalogs"
                role="tablist"
              >
                <button
                  className={`nav-link color-text ${userInfoStyles.navLink} active`}
                  data-bs-toggle="tab"
                  data-bs-target="#all-catalogs"
                >
                  Усі
                </button>

                {userCatalogs.map((c) => (
                  <button
                    key={c.id}
                    className={`nav-link color-text ${userInfoStyles.navLink}`}
                    data-bs-toggle="tab"
                    data-bs-target={`#catalog${c.id}`}
                  >
                    {c.title}
                  </button>
                ))}

                {user.id == authUser.getUser()?.id && (
                  <>
                    <button
                      className={`btn btn-button my-2 color-text ${userInfoStyles.catalogEdit} ${userInfoStyles.catalogEdit}`}
                      id="catalogEdit"
                      data-bs-toggle="tab"
                      data-bs-target="#edit-catalogs"
                    >
                      Редагувати каталоги
                    </button>

                    <button
                      className={`btn btn-button position-absolute end-0 color-text ${userInfoStyles.catalogEditMobile}`}
                      id="catalog-edit-mobile"
                      data-bs-toggle="tab"
                      data-bs-target="#edit-catalogs"
                    >
                      <i className="bi bi-card-list"></i>
                    </button>
                  </>
                )}
              </div>

              <div
                className={`${userInfoStyles.tabsContainer} tab-container tab-content`}
              >
                {/* <!-- All catalogs --> */}
                <div className={`tab-pane active`} id="all-catalogs">
                  <BookMarkList
                    bookmarks={markCatalogs.reduce(
                      (all, current) => all.concat(...current.marks),
                      []
                    )}
                  />
                </div>

                {/* User catalogs */}
                {userCatalogs &&
                  userCatalogs.map((c, i) => (
                    <div
                      key={c.id + i + i}
                      className="tab-pane"
                      id={`catalog${c.id}`}
                    >
                      <BookMarkList
                        bookmarks={
                          markCatalogs.find((catalog) => catalog.id === c.id)
                            ?.marks || []
                        }
                      />
                    </div>
                  ))}

                {/* <!-- Edit catalogs --> */}
                {user.id == authUser.getUser()?.id && (
                  <div
                    className="tab-pane"
                    id="edit-catalogs"
                    aria-labelledby="catalog-edit"
                  >
                    <div className="border-radius text-truncate mb-2">
                      {/* <!-- Edit catalog 1 --> */}
                      <div className="creator-form my-2">
                        <div className="d-flex justify-content-between mb-3">
                          <input
                            className={`form-control me-2`}
                            type="text"
                            name="add-catalog"
                            id="add-catalog"
                            placeholder="Введіть новий каталог"
                            onChange={newCatalog.title.onChange}
                            style={{
                              backgroundColor: 'white',
                            }}
                          />
                          <button
                            className="btn btn-button"
                            onClick={saveNewCatalog}
                          >
                            +
                          </button>
                        </div>
                        <div className="mb-3">
                          <div className="form-check form-switch">
                            <input
                              className={`form-check-input ${userInfoStyles.formCheckInput}`}
                              type="checkbox"
                              id="isPublic"
                              onChange={() =>
                                newCatalog.isPublic.setValue(
                                  !newCatalog.isPublic.value
                                )
                              }
                              checked={newCatalog.isPublic.value}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="isPublic"
                            >
                              Публічний каталог
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* <!-- Edit catalogs     --> */}
                      {userCatalogs &&
                        userCatalogs.map((c) => (
                          <div className="tab background-color p-3 border-radius text-truncate mb-2">
                            <div
                              className={`tab-inner text-truncate ${userInfoStyles.tabInner}`}
                            >
                              <div className="text-truncate p-2">{c.title}</div>

                              <div
                                className={`group-buttons ${userInfoStyles.groupButtons}`}
                              >
                                <button
                                  className="btn btn-button mx-1 color-text"
                                  attr={`data-id= '' + ${c.id}`}
                                  onClick={() => handleEditClick(c)}
                                >
                                  <i className="bi bi-pencil"></i>
                                </button>

                                <button
                                  className="btn btn-danger mx-1"
                                  onClick={() => deleteCatalog(c.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {selectedCatalog && (
                <EditCatalogModal
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  catalog={selectedCatalog}
                  onSave={handleSave}
                />
              )}
            </div>
          </div>

          {user.id == authUser.getUser()?.id && <UserSettings user={user} />}
        </div>
      </div>
    </>
  )
}
