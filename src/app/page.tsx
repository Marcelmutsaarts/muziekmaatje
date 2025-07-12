'use client'

import { useState, useEffect } from 'react'
import LessonPrepForm from '@/components/LessonPrepForm'
import LessonPrepDisplay from '@/components/LessonPrepDisplay'
import ExerciseSchemeForm from '@/components/ExerciseSchemeForm'
import ProfessionalExerciseDisplay from '@/components/ProfessionalExerciseDisplay'
import TabNavigation from '@/components/TabNavigation'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'lesson-prep' | 'exercise-scheme'>('lesson-prep')
  const [lessonPrep, setLessonPrep] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [exerciseScheme, setExerciseScheme] = useState<string>('')
  const [isExerciseLoading, setIsExerciseLoading] = useState(false)
  const [currentStudentName, setCurrentStudentName] = useState<string>('')
  const [lessonPrepFormName, setLessonPrepFormName] = useState<string>('')

  // Use the name from the lesson prep form input, not auto-extracted
  useEffect(() => {
    if (lessonPrepFormName) {
      setCurrentStudentName(lessonPrepFormName)
    }
  }, [lessonPrepFormName])

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

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          {activeTab === 'lesson-prep' ? (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div>
                <LessonPrepForm 
                  onLessonPrepGenerated={setLessonPrep}
                  setIsLoading={setIsLoading}
                  onStudentNameChange={setLessonPrepFormName}
                />
              </div>

              {/* Display Section */}
              <div>
                <LessonPrepDisplay 
                  lessonPrep={lessonPrep}
                  isLoading={isLoading}
                  onContentChange={setLessonPrep}
                />
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Exercise Form Section */}
              <div>
                <ExerciseSchemeForm 
                  existingLessonPrep={lessonPrep}
                  onExerciseSchemeGenerated={setExerciseScheme}
                  setIsLoading={setIsExerciseLoading}
                  onStudentNameChange={setCurrentStudentName}
                  prefillStudentName={lessonPrepFormName}
                />
              </div>

              {/* Exercise Display Section */}
              <div>
                <ProfessionalExerciseDisplay 
                  exerciseScheme={exerciseScheme}
                  isLoading={isExerciseLoading}
                  studentName={currentStudentName}
                  onContentChange={setExerciseScheme}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}