import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ListTodo, CheckCircle } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    {
      path: '/',
      label: 'To Do',
      icon: ListTodo,
      isActive: location.pathname === '/'
    },
    {
      path: '/completed',
      label: 'Completed',
      icon: CheckCircle,
      isActive: location.pathname === '/completed'
    }
  ]

  return (
    <nav className="bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-4 text-sm font-medium transition-colors ${
                  item.isActive
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </NavLink>
            )
          })}
        </div>
      </div>
    </nav>
  )
}