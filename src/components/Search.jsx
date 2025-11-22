
export default function SearchBar() {
  const handleSearch = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const query = formData.get("search")
    console.log("Search query:", query)
    // Add your search logic here
  }

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white h-10">
        <input
          type="text"
          name="search"
          placeholder="Search name or email..."
          className="flex-1 px-4 py-1 outline-none text-gray-700"
        />
        <button type="submit" className="bg-black text-white px-6 py-3 hover:bg-gray-800 transition-colors">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>
    </form>
  )
}
