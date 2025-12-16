import { X } from 'lucide-react';

interface StandardModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export default function StandardModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  showCancel = true
}: StandardModalProps) {
  if (!isOpen) return null;

  const typeStyles = {
    success: 'border-green-500 bg-green-500/10',
    error: 'border-red-500 bg-red-500/10',
    warning: 'border-amber-500 bg-amber-500/10',
    info: 'border-blue-500 bg-blue-500/10'
  };

  const buttonStyles = {
    success: 'bg-green-500 hover:bg-green-600',
    error: 'bg-red-500 hover:bg-red-600',
    warning: 'bg-amber-500 hover:bg-amber-600',
    info: 'bg-blue-500 hover:bg-blue-600'
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`relative w-full max-w-md mx-4 p-6 rounded-2xl border-2 ${typeStyles[type]} bg-gray-900 shadow-2xl animate-scaleIn`}>
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
        >
          <X size={24} />
        </button>

        {/* Título */}
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>

        {/* Mensagem */}
        <p className="text-gray-300 text-sm leading-relaxed mb-6">{message}</p>

        {/* Botões */}
        <div className="flex gap-3">
          {showCancel && (
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-3 ${buttonStyles[type]} text-white font-bold rounded-lg transition`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}