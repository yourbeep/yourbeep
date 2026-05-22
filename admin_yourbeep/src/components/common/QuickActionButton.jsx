const QuickActionButton = ({ icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 p-5 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer transition-all hover:bg-primary-light hover:border-primary hover:-translate-y-0.5 min-h-[100px]"
    >
      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl">
        {icon}
      </div>
      <span className="text-xs font-semibold text-gray-900 text-center">
        {label}
      </span>
    </button>
  )
}

export default QuickActionButton