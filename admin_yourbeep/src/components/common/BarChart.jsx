const BarChart = ({ data, height = 200 }) => {
  const maxValue = Math.max(...data.map(d => d.new + d.returning))
  
  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <div className="flex items-end justify-around h-full gap-4 pb-[30px]">
        {data.map((item, index) => {
          const newHeight = (item.new / maxValue) * 100
          const returningHeight = (item.returning / maxValue) * 100
          
          return (
            <div 
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="w-full flex flex-col gap-1 items-center">
                <div className="w-3/5 rounded-t-md transition-all duration-300" style={{ height: `${newHeight}%`, minHeight: '20px', background: 'var(--text-h)' }} />
                <div className="w-3/5 rounded-b-md transition-all duration-300" style={{ height: `${returningHeight}%`, minHeight: '20px', background: 'var(--primary)' }} />
              </div>
              
              <span className="text-[11px] text-gray-400 font-semibold">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
      
      <div className="flex justify-center gap-5 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--text-h)' }} />
          <span className="text-[11px] text-gray-600">New</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'var(--primary)' }} />
          <span className="text-[11px] text-gray-600">Returning</span>
        </div>
      </div>
    </div>
  )
}

export default BarChart