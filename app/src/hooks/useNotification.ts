import { toast } from 'react-toastify'

export default function useNotification() {
  return {
    success: (message: string) => {
      toast.dismiss()
      toast(message, {
        type: 'success',
        hideProgressBar: true,
      })
    },
    error: (message: string) => {
      toast.dismiss()
      toast(message, {
        type: 'error',
        hideProgressBar: true,
      })
    },
  }
}
