const LineChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue
  
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((d.value - minValue) / range) * 80 - 10
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="relative w-full" style={{ height: `${height}px` }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
        className="block"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#areaGradient)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="0.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100
          const y = 100 - ((d.value - minValue) / range) * 80 - 10
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="1"
              fill="var(--primary)"
            />
          )
        })}
      </svg>
      
      <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
        {data.map((d, i) => (
          <span 
            key={i}
            className="text-[11px] text-gray-400 font-medium"
          >
            {d.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default LineChart