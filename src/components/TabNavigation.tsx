'use client'

interface TabNavigationProps {
  activeTab: 'lesson-prep' | 'exercise-scheme'
  onTabChange: (tab: 'lesson-prep' | 'exercise-scheme') => void
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex bg-white rounded-xl shadow-lg p-2 mb-8 max-w-md mx-auto">
      <button
        onClick={() => onTabChange('lesson-prep')}
        className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          activeTab === 'lesson-prep'
            ? 'bg-purple-600 text-white shadow-md'
            : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
        }`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Lesvoorbereiding
      </button>
      
      <button
        onClick={() => onTabChange('exercise-scheme')}
        className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
          activeTab === 'exercise-scheme'
            ? 'bg-green-600 text-white shadow-md'
            : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
        }`}
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15l4-4 4 4" />
        </svg>
        Oefenschema
      </button>
    </div>
  )
}