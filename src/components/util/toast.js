import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const options = {
  position: 'bottom-left',
  autoClose: 8000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  className: 'background-color color-text',
}

export function createSuccessToast(message) {
  toast.success(message, options)
}

export function createErrorToast(message) {
  toast.error(message, options)
}
