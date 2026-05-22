const StatCard = ({ title, value, change, trend, icon }) => {
  const isPositive = trend === 'up'
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 transition-transform hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-[11px] font-semibold text-gray-500 mb-2 uppercase tracking-wide">
            {title}
          </p>
          <p className="text-[28px] font-bold text-gray-900 m-0 tracking-tight">
            {value}
          </p>
        </div>
        {icon && (
          <div className="text-xl opacity-60">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="flex items-center gap-1">
          <span className={`text-xs font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? '↑' : '↓'} {change}
          </span>
          <span className="text-xs text-gray-500">
            vs last period
          </span>
        </div>
      )}
    </div>
  )
}

export default StatCard