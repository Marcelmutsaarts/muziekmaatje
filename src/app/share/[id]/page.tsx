'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function SharePage() {
  const params = useParams()
  const [exerciseScheme, setExerciseScheme] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const id = params.id as string
    if (id) {
      const savedScheme = localStorage.getItem(`exercise-scheme-${id}`)
      if (savedScheme) {
        setExerciseScheme(savedScheme)
      } else {
        setError(true)
      }
      setLoading(false)
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Oefenschema laden...</p>
        </div>
      </div>
    )
  }

  if (error || !exerciseScheme) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-100 p-6 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.864-.833-2.634 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Oefenschema niet gevonden</h1>
          <p className="text-gray-600 mb-6">Het opgevraagde oefenschema bestaat niet of is verlopen.</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Terug naar MuziekMaatje
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Jouw Oefenschema
          </h1>
          
          <p className="text-lg text-gray-600">
            Gepersonaliseerd huiswerk schema
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-green-700">Oefenschema</h2>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      import('@/utils/pdfGenerator').then(({ generateTextPDF }) => {
                        generateTextPDF(exerciseScheme, {
                          title: 'Oefenschema',
                          type: 'exercise-scheme'
                        })
                      })
                    }
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </div>
            </div>
            
            <div className="prose prose-green max-w-none">
              <div 
                className="whitespace-pre-wrap text-gray-700"
                dangerouslySetInnerHTML={{ __html: formatSharedContent(exerciseScheme) }}
              />
            </div>
            
            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
              <p>Gegenereerd door <strong>MuziekMaatje</strong> - AI-assistent voor zangpedagogen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatSharedContent(text: string): string {
  let formatted = text
    // Convert headers
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-6 mb-3 text-green-700">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-8 mb-4 text-green-800">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-green-900">$1</h1>')
    
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800 bg-green-100 px-1 rounded">$1</strong>')
    
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em class="text-gray-700">$1</em>')
    
    // Convert bullet points
    .replace(/^- (.*?)$/gm, '<li class="mb-2 text-gray-700">$1</li>')
    .replace(/(<li.*?<\/li>\n)+/g, '<ul class="list-disc list-inside mb-4 space-y-1 ml-4">$&</ul>')
    
    // Convert numbered lists
    .replace(/^\d+\. (.*?)$/gm, '<li class="mb-2 text-gray-700">$1</li>')
    .replace(/(<li class="mb-2 text-gray-700">.*?<\/li>\n)+/g, '<ol class="list-decimal list-inside mb-4 space-y-1 ml-4">$&</ol>')
    
    // Add paragraph tags
    .replace(/^(?!<[hulo])(.+)$/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>')
  
  return formatted
}