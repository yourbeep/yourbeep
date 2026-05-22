const Card = ({ title, subtitle, icon, children, action, className = '' }) => {
  return (
    <div className={`bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full ${className}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="w-9 h-9 rounded-lg bg-primary-light flex items-center justify-center text-base">
              {icon}
            </div>
          )}
          <div>
            <h3 className="text-base font-bold text-gray-900 m-0">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {action && (
          <button className="bg-transparent border-none text-primary text-xs font-semibold cursor-pointer px-2 py-1">
            {action}
          </button>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}

export default Card