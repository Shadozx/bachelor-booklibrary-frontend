import { Route, Routes } from 'react-router-dom'
import AdminPanelPage from '../pages/admin/AdminPanelPage/AdminPanelPage'
import EditBookPage from '../pages/admin/EditBookPage/EditBookPage'
import EditChapterPage from '../pages/admin/EditChapterPage/EditChapterPage'
import CreateBookPage from '../pages/admin/CreateBookPage/CreateBookPage'
import CreateChapterPage from '../pages/admin/CreateChapterPage/CreateChapterPage'

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminPanelPage />}></Route>
      <Route path="/book/:bookId/edit" element={<EditBookPage />}></Route>
      <Route path="/book/create" element={<CreateBookPage />}></Route>
      <Route
        path="/book/:bookId/chapter/create"
        element={<CreateChapterPage />}
      ></Route>
      <Route
        path="/book/:bookId/chapter/:chapterNumber/edit"
        element={<EditChapterPage />}
      ></Route>
    </Routes>
  )
}
