// import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

import './PhotoDropzone.css'

export default function PhotoDropzone({ onDrop }) {
  // const onDrop = useCallback((acceptedFiles) => {
  //   // Do something with the uploaded files
  //   console.log(acceptedFiles)

  //   const file = acceptedFiles[0] // Отримуємо перший файл зі списку завантажених
  //   const formData = new FormData()
  //   formData.append('file', file) // Додаємо файл до FormData

  //   console.log(file)
  //   console.log(formData)
  // }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png'] },
    maxSize: 1048576,
    maxFiles: 1,
    onDrop,
  })

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'active' : ''}`}
    >
      <input {...getInputProps()} />
      <p>Перетягніть фотографію</p>
    </div>
  )
}
