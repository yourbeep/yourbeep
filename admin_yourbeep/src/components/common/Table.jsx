const Table = ({ columns, data, onRowAction }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="grid p-4 bg-gray-50 border-b border-gray-200 gap-3" style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}>
        {columns.map((column, index) => (
          <div
            key={index}
            className="text-[11px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1"
          >
            {column.label}
            {column.sortable && <span className="text-[10px]">↓</span>}
          </div>
        ))}
      </div>

      <div className="max-h-[420px] overflow-y-auto">
        {data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid p-4 border-b border-gray-100 gap-3 items-center transition-colors hover:bg-gray-50"
            style={{ gridTemplateColumns: columns.map(col => col.width || '1fr').join(' ') }}
          >
            {columns.map((column, colIndex) => (
              <div key={colIndex}>
                {column.render ? column.render(row, rowIndex) : row[column.key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Table
