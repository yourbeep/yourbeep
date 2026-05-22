const DonutChart = ({ data, centerValue, centerLabel }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  let currentAngle = -90
  
  const createArc = (percentage, startAngle) => {
    const angle = (percentage / 100) * 360
    const endAngle = startAngle + angle
    
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    
    const x1 = 50 + 40 * Math.cos(startRad)
    const y1 = 50 + 40 * Math.sin(startRad)
    const x2 = 50 + 40 * Math.cos(endRad)
    const y2 = 50 + 40 * Math.sin(endRad)
    
    const largeArc = angle > 180 ? 1 : 0
    
    return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`
  }
  
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative w-[200px] h-[200px]">
        <svg width="200" height="200" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--border-light)"
            strokeWidth="12"
          />
          
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100
            const path = createArc(percentage, currentAngle)
            currentAngle += (percentage / 100) * 360
            
            return (
              <path
                key={index}
                d={path}
                fill={item.color}
                opacity="0.9"
              />
            )
          })}
          
          <circle
            cx="50"
            cy="50"
            r="28"
            fill="var(--bg-white)"
          />
        </svg>
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-[28px] font-bold text-gray-900 leading-none">
            {centerValue}
          </div>
          <div className="text-[11px] text-gray-400 mt-1">
            {centerLabel}
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(0)
          return (
            <div 
              key={index}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <span className="text-sm text-gray-600">
                  {item.label}
                </span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {percentage}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default DonutChart