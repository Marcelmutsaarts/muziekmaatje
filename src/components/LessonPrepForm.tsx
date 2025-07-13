'use client'

import { useState } from 'react'

interface LessonPrepFormProps {
  onLessonPrepGenerated: (prep: string) => void
  setIsLoading: (loading: boolean) => void
  onStudentNameChange?: (name: string) => void
}

const methodologies = [
  'Estill Voice Training',
  'Complete Vocal Technique (CVT)',
  'Speech Level Singing (SLS)',
  'Bel Canto',
  'Mix Voice Training',
  'Alexander Techniek',
  'Feldenkrais',
  'Lichtenberger Methode',
  'Algemene pedagogiek',
  'Anders/Custom'
]

const levels = [
  'Beginner',
  'Gevorderd beginner',
  'Intermediair',
  'Gevorderd',
  'Professioneel'
]

export default function LessonPrepForm({ onLessonPrepGenerated, setIsLoading, onStudentNameChange }: LessonPrepFormProps) {
  const [studentName, setStudentName] = useState('')
  const [background, setBackground] = useState('')
  const [lessonGoal, setLessonGoal] = useState('')
  const [methodology, setMethodology] = useState('')
  const [customMethodology, setCustomMethodology] = useState('')
  const [level, setLevel] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Use custom methodology if "Anders/Custom" is selected
    const finalMethodology = methodology === 'Anders/Custom' ? customMethodology : methodology

    try {
      const response = await fetch('/api/lesson-prep', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentName,
          background,
          lessonGoal,
          methodology: finalMethodology,
          level
        }),
      })

      const data = await response.json()
      onLessonPrepGenerated(data.lessonPrep)
    } catch (error) {
      console.error('Error generating lesson prep:', error)
      onLessonPrepGenerated('Er is een fout opgetreden bij het genereren van de lesvoorbereiding.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Nieuwe Lesvoorbereiding
      </h2>
      
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
              onStudentNameChange?.(e.target.value)
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Bijv. Anna de Vries"
            required
          />
        </div>

        {/* Background */}
        <div>
          <label htmlFor="background" className="block text-sm font-medium text-gray-700 mb-2">
            Achtergrond & Voorgeschiedenis
          </label>
          <textarea
            id="background"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Beschrijf de achtergrond van de leerling, eerdere lessen, bijzonderheden..."
            required
          />
        </div>

        {/* Lesson Goal */}
        <div>
          <label htmlFor="lessonGoal" className="block text-sm font-medium text-gray-700 mb-2">
            Doelstelling van deze les
          </label>
          <textarea
            id="lessonGoal"
            value={lessonGoal}
            onChange={(e) => setLessonGoal(e.target.value)}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Wat wil je bereiken in deze les?"
            required
          />
        </div>

        {/* Methodology */}
        <div>
          <label htmlFor="methodology" className="block text-sm font-medium text-gray-700 mb-2">
            Methodiek
          </label>
          <select
            id="methodology"
            value={methodology}
            onChange={(e) => {
              setMethodology(e.target.value)
              // Clear custom methodology when switching away from custom option
              if (e.target.value !== 'Anders/Custom') {
                setCustomMethodology('')
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Kies een methodiek</option>
            {methodologies.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Methodology Input */}
        {methodology === 'Anders/Custom' && (
          <div>
            <label htmlFor="customMethodology" className="block text-sm font-medium text-gray-700 mb-2">
              Eigen methodiek invullen
            </label>
            <input
              type="text"
              id="customMethodology"
              value={customMethodology}
              onChange={(e) => setCustomMethodology(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Bijv. Somatic Voicework, Roy Hart Method, etc."
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Vul hier je eigen methodiek of combinatie van methodieken in.
            </p>
          </div>
        )}

        {/* Level */}
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
            Niveau van de leerling
          </label>
          <select
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            required
          >
            <option value="">Selecteer niveau</option>
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors duration-200 flex items-center justify-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Genereer Lesvoorbereiding
        </button>
      </form>
    </div>
  )
}