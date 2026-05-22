const SearchBar = ({ placeholder, value, onChange }) => {
  return (
    <div className="relative flex-1 max-w-[400px]">
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
        🔍
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-2.5 pl-10 border border-gray-200 rounded-lg text-sm text-gray-900 bg-white outline-none transition-colors focus:border-primary"
      />
    </div>
  )
}

export default SearchBar