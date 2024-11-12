import { toast } from 'react-toastify'

export default function useNotification() {
  return {
    success: (message: string) => {
      toast.dismiss()
      toast(message, {
        type: 'success',
        position: 'bottom-center',
        hideProgressBar: true,
      })
    },
    error: (message: string) => {
      toast.dismiss()
      toast(message, {
        type: 'error',
        position: 'bottom-center',
        hideProgressBar: true,
      })
    },
  }
}
