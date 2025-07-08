'use client'

import { useState } from 'react'
import LessonPrepForm from '@/components/LessonPrepForm'
import LessonPrepDisplay from '@/components/LessonPrepDisplay'

export default function Home() {
  const [lessonPrep, setLessonPrep] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            MuziekMaatje
          </h1>
          
          <p className="text-lg text-gray-600">
            AI-assistent voor zangpedagogen
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div>
              <LessonPrepForm 
                onLessonPrepGenerated={setLessonPrep}
                setIsLoading={setIsLoading}
              />
            </div>

            {/* Display Section */}
            <div>
              <LessonPrepDisplay 
                lessonPrep={lessonPrep}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}