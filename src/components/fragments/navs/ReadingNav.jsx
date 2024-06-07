export default function ReadingNav({ title, book, chapters }) {
  return (
    <>
      <div
        className="navigation offcanvas offcanvas-start"
        data-bs-scroll="true"
        tabIndex="-1"
        id="listChapters"
        aria-labelledby="listChaptersLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasWithBothOptionsLabel">
            Зміст книги
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <div className="chapters container">
            {chapters.map((c, i) => (
              <a
                key={c.id}
                className="elem-link chapter fs-6"
                href={`/book/${book.id}/ch/${c.chapterNumber}`}
              >
                {i + 1 + '. ' + c.title}
              </a>
            ))}
          </div>
        </div>
      </div>
      <nav
        id="chapter-menu"
        className="navigation navbar navbar-expand-lg navbar-dark  position-relative position-fixed top-0"
        style={{ width: '100%' }}
      >
        <div className="container-fluid">
          <button
            className="navigation-elem btn btn-button"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#listChapters"
            aria-controls="listChapters"
          >
            <i className="navbar-item bi bi-list"></i>
          </button>

          <div
            data-bs-toggle="offcanvas"
            data-bs-target="#listChapters"
            aria-controls="listChapters"
            className="el-title text-truncate"
          >
            {title}
          </div>

          <div className="d-flex justify-content-between">
            <div
              className="mx-2"
              onClick={() =>
                document.body.classList.contains('dark-theme')
                  ? document.body.classList.remove('dark-theme')
                  : document.body.classList.add('dark-theme')
              }
            >
              <i id="switcher-theme" className="bi bi-moon"></i>
            </div>
            <a
              className="navigation-elem btn btn-button mx-2"
              href={`/book/${book.id}`}
            >
              <i className="navbar-item bi bi-box-arrow-in-right"></i>
            </a>
          </div>
        </div>
      </nav>
    </>
  )
}
