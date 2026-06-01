import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const toastStyles = {
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-800',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
  },
  error: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-800',
    icon: AlertCircle,
    iconColor: 'text-rose-500',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-800',
    icon: Info,
    iconColor: 'text-blue-500',
  },
}

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex w-[min(100vw-1.5rem,24rem)] flex-col gap-3 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info
        const Icon = style.icon

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border ${style.bg} ${style.border} ${style.text} px-4 py-3 shadow-xl shadow-slate-900/10 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-300`}
          >            <Icon className={`h-5 w-5 shrink-0 ${style.iconColor}`} />
            <p className="text-sm font-medium">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-auto shrink-0 text-opacity-70 hover:text-opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
