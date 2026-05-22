const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = []
  
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...')
    }
  }

  return (
    <div className="flex items-center gap-2 justify-center py-5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 text-sm"
      >
        ←
      </button>

      {pages.map((page, index) => (
        page === '...' ? (
          <span key={index} className="text-gray-400 px-1">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 border border-gray-200 rounded-md text-sm cursor-pointer ${currentPage === page ? 'bg-primary text-white font-semibold' : 'bg-white text-gray-600'}`}
          >
            {page}
          </button>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-600 disabled:cursor-not-allowed disabled:opacity-50 text-sm"
      >
        →
      </button>
    </div>
  )
}

export default Pagination