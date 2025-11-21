import { FiLayout, FiUpload, FiHome } from 'react-icons/fi'

function Sidebar({ isOpen, setIsOpen, activeView, setActiveView }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { id: 'upload', label: 'Upload CV', icon: FiUpload },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white shadow-xl z-40 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-center">
              {isOpen ? (
                <div className="flex items-center space-x-2">
                  <FiLayout className="text-indigo-600" size={24} />
                  <span className="text-xl font-bold text-gray-800">CV Automation</span>
                </div>
              ) : (
                <FiLayout className="text-indigo-600" size={24} />
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id)
                    if (window.innerWidth < 1024) {
                      setIsOpen(false)
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon size={20} />
                  {isOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Toggle button for desktop */}
          <div className="p-4 border-t border-gray-200 hidden lg:block">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isOpen ? (
                <>
                  <span className="mr-2">Collapse</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </>
              ) : (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar

