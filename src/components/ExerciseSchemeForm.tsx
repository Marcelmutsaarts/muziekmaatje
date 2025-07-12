'use client'

import React, { useState } from 'react'

interface ExerciseSchemeFormProps {
  existingLessonPrep: string
  onExerciseSchemeGenerated: (scheme: string) => void
  setIsLoading: (loading: boolean) => void
  onStudentNameChange: (name: string) => void
  prefillStudentName?: string
}

export default function ExerciseSchemeForm({ 
  existingLessonPrep, 
  onExerciseSchemeGenerated, 
  setIsLoading,
  onStudentNameChange,
  prefillStudentName 
}: ExerciseSchemeFormProps) {
  const [lessonContent, setLessonContent] = useState(existingLessonPrep || '')
  const [studentName, setStudentName] = useState('')
  const [practiceTime, setPracticeTime] = useState(20)
  const [focusAreas, setFocusAreas] = useState('')
  const [difficulty, setDifficulty] = useState('medium')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/exercise-scheme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonContent,
          studentName,
          practiceTime,
          focusAreas,
          difficulty
        }),
      })

      const data = await response.json()
      onExerciseSchemeGenerated(data.exerciseScheme)
    } catch (error) {
      console.error('Error generating exercise scheme:', error)
      onExerciseSchemeGenerated('Er is een fout opgetreden bij het genereren van het oefenschema.')
    } finally {
      setIsLoading(false)
    }
  }

  // Update lesson content when existingLessonPrep changes
  React.useEffect(() => {
    if (existingLessonPrep && !lessonContent) {
      setLessonContent(existingLessonPrep)
    }
  }, [existingLessonPrep, lessonContent])

  // Auto-fill student name when prefillStudentName changes
  React.useEffect(() => {
    if (prefillStudentName && prefillStudentName !== studentName) {
      setStudentName(prefillStudentName)
      onStudentNameChange(prefillStudentName)
    }
  }, [prefillStudentName, onStudentNameChange])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center mb-6">
        <div className="bg-green-100 p-3 rounded-lg mr-4">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 15l4-4 4 4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Oefenschema Generator
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Student Name */}
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
            Naam van de leerling
          </label>
          <input
            type="text"
            id="studentName"
            value={studentName}
            onChange={(e) => {
              setStudentName(e.target.value)
              onStudentNameChange(e.target.value)
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Bijv. Anna de Vries"
            required
          />
        </div>

        {/* Lesson Content */}
        <div>
          <label htmlFor="lessonContent" className="block text-sm font-medium text-gray-700 mb-2">
            Lesvoorbereiding inhoud
          </label>
          <textarea
            id="lessonContent"
            value={lessonContent}
            onChange={(e) => setLessonContent(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder={existingLessonPrep ? "Lesvoorbereiding wordt automatisch ingevuld..." : "Plak hier de lesvoorbereiding of typ de belangrijkste punten..."}
            required
          />
          {existingLessonPrep && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Lesvoorbereiding automatisch ingevuld
            </p>
          )}
          {prefillStudentName && studentName === prefillStudentName && (
            <p className="text-sm text-blue-600 mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Naam automatisch overgenomen uit lesvoorbereiding
            </p>
          )}
        </div>

        {/* Practice Time Slider */}
        <div>
          <label htmlFor="practiceTime" className="block text-sm font-medium text-gray-700 mb-2">
            Beschikbare oefentijd per dag: <span className="font-bold text-green-600">{practiceTime} minuten</span>
          </label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">10 min</span>
            <input
              type="range"
              id="practiceTime"
              min="10"
              max="60"
              step="5"
              value={practiceTime}
              onChange={(e) => setPracticeTime(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
            />
            <span className="text-sm text-gray-500">60 min</span>
          </div>
          <div className="mt-2 text-center">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              practiceTime <= 15 ? 'bg-yellow-100 text-yellow-800' :
              practiceTime <= 30 ? 'bg-green-100 text-green-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {practiceTime <= 15 ? '⚡ Kort & krachtig' :
               practiceTime <= 30 ? '🎯 Balans' :
               '🏃‍♀️ Intensief'}
            </span>
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Moeilijkheidsgraad oefeningen
          </label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="easy">Makkelijk - Basis herhalingen</option>
            <option value="medium">Gemiddeld - Nieuwe technieken oefenen</option>
            <option value="hard">Uitdagend - Verdieping en verfijning</option>
          </select>
        </div>

        {/* Focus Areas */}
        <div>
          <label htmlFor="focusAreas" className="block text-sm font-medium text-gray-700 mb-2">
            Extra aandachtspunten <span className="text-gray-500">(optioneel)</span>
          </label>
          <textarea
            id="focusAreas"
            value={focusAreas}
            onChange={(e) => setFocusAreas(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Bijv. Extra aandacht voor ademhaling, werk aan vibrato, focus op hoge noten..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Genereer Oefenschema
        </button>
      </form>

      <style jsx>{`
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          background: #16a34a;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider-green::-moz-range-thumb {
          height: 20px;
          width: 20px;
          background: #16a34a;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  )
}