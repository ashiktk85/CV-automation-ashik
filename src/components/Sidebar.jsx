import { FiLayout, FiHome, FiFileText, FiChevronDown, FiChevronRight, FiXCircle, FiLogOut } from 'react-icons/fi'
import { useState } from 'react'

function Sidebar({ isOpen, setIsOpen, activeView, setActiveView, onLogout }) {
  const [applicationsExpanded, setApplicationsExpanded] = useState(true)
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FiHome },
    { 
      id: 'applications', 
      label: 'Applications', 
      icon: FiFileText,
      hasSubmenu: true,
      submenu: [
        { id: 'shopify', label: 'Shopify' },
        { id: 'starred', label: 'Saved' }
      ]
    },
    { id: 'rejected', label: 'Rejected CVs', icon: FiXCircle },
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
                  <span className="text-xl font-bold text-gray-800">Avoria</span>
                </div>
              ) : (
                <FiLayout className="text-indigo-600" size={24} />
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeView === item.id || (item.hasSubmenu && item.submenu?.some(sub => sub.id === activeView))

              if (item.hasSubmenu) {
                return (
                  <div key={item.id} className="mb-2">
                    <button
                      onClick={() => {
                        if (isOpen) {
                          setApplicationsExpanded(!applicationsExpanded)
                        } else {
                          setActiveView(item.submenu[0].id)
                        }
                        if (window.innerWidth < 1024) {
                          setIsOpen(false)
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-black text-white shadow-md'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                      title={!isOpen ? item.label : ''}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={20} />
                        {isOpen && (
                          <span className="font-medium">{item.label}</span>
                        )}
                      </div>
                      {isOpen && (
                        applicationsExpanded ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />
                      )}
                    </button>
                    {isOpen && applicationsExpanded && item.submenu && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((subItem) => {
                          const isSubActive = activeView === subItem.id
                          return (
                            <button
                              key={subItem.id}
                              onClick={() => {
                                setActiveView(subItem.id)
                                if (window.innerWidth < 1024) {
                                  setIsOpen(false)
                                }
                              }}
                              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                                isSubActive
                                  ? 'bg-gray-800 text-white'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span className="w-2 h-2 rounded-full bg-current"></span>
                              <span>{subItem.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id)
                    if (window.innerWidth < 1024) {
                      setIsOpen(false)
                    }
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 mb-2 ${
                    isActive
                      ? 'bg-black text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-200'
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

          {/* Logout and Toggle buttons */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            {/* Logout Button */}
            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-red-600 hover:bg-red-50"
              title={!isOpen ? 'Logout' : ''}
            >
              <FiLogOut size={20} />
              {isOpen && (
                <span className="font-medium">Logout</span>
              )}
            </button>

            {/* Toggle button for desktop */}
            <div className="hidden lg:block">
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
        </div>
      </aside>
    </>
  )
}

export default Sidebar

