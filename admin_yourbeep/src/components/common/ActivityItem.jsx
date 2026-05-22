const ActivityItem = ({ icon, iconBg, title, description, time }) => {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ background: iconBg || '#e6f4f4' }}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 mb-0.5">
          {title}
        </p>
        <p className="text-xs text-gray-600 m-0 truncate">
          {description}
        </p>
      </div>
      <span className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
        {time}
      </span>
    </div>
  )
}

export default ActivityItem