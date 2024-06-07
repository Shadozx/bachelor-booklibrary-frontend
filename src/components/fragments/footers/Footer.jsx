export default function Footer() {
  return (
    <footer className="navigation py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>Контактна інформація</h5>
            <p>Це є сайт для користувачів які хочуть зручно почитати книги</p>
          </div>
          <div className="col-md-6">
            <h5>Посилання</h5>
            <ul className="list-unstyled">
              <li>
                <a className="elem-link" href="/">
                  Головна сторінка
                </a>
              </li>
              <li>
                <a className="elem-link" href="/catalog">
                  Книги
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <p>&copy; 2024. Усі права захищені.</p>
      </div>
    </footer>
  )
}
