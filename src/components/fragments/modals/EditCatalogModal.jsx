import React, { useState, useEffect } from 'react'

export default function EditCatalogModal({ show, onHide, catalog, onSave }) {
  const [title, setTitle] = useState(catalog.title)
  const [isPublic, setIsPublic] = useState(catalog.isPublic)

  useEffect(() => {
    setTitle(catalog.title)
    setIsPublic(catalog.isPublic)
  }, [catalog])

  const handleSave = () => {
    onSave({ ...catalog, title, isPublic })
    onHide()
  }

  return (
    <div className={`modal ${show ? 'd-block' : 'd-none'}`} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Редагувати каталог</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onHide}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label htmlFor="catalogTitle" className="form-label">
                Назва каталогу
              </label>
              <input
                type="text"
                className="form-control"
                id="catalogTitle"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isPublic">
                Публічний каталог
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onHide}
            >
              Закрити
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
            >
              Зберегти
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
