/* eslint-disable react/prop-types */
export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#383838] rounded-xl w-full max-w-sm p-6 text-center">
        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>

        {/* Message */}
        <p className="text-gray-300 mb-6">{message}</p>

        {/* Actions */}
        <div className="flex justify-center space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-white rounded bg-[#383838] hover:bg-[#484848] cursor-pointer transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-[#FF9200] text-black rounded cursor-pointer transition-colors font-semibold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
