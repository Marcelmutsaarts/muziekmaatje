'use client'

import { useState } from 'react'

interface LessonPrepDisplayProps {
  lessonPrep: string
  isLoading: boolean
}

export default function LessonPrepDisplay({ lessonPrep, isLoading }: LessonPrepDisplayProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const printLessonPrep = () => {
    const printContent = document.getElementById('lesson-prep-content')
    if (printContent) {
      const printWindow = window.open('', '', 'height=800,width=600')
      printWindow?.document.write(`
        <html>
          <head>
            <title>Lesvoorbereiding</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
              h1 { color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px; }
              h2 { color: #8b5cf6; margin-top: 30px; }
              h3 { color: #a78bfa; margin-top: 20px; }
              .section { margin-bottom: 25px; padding: 15px; border-left: 4px solid #e5e7eb; }
              .timing { background-color: #f3f4f6; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
              ul, ol { padding-left: 20px; }
              li { margin-bottom: 5px; }
              .highlight { background-color: #fef3c7; padding: 2px 4px; border-radius: 3px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)
      printWindow?.document.close()
      printWindow?.print()
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
      {/* Header with actions */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Lesvoorbereiding</h2>
            <p className="text-purple-100 text-sm">Gegenereerd door MuziekMaatje AI</p>
          </div>
          {lessonPrep && (
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(lessonPrep, 'full')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copiedSection === 'full' ? 'Gekopieerd!' : 'Kopieer'}
              </button>
              <button
                onClick={printLessonPrep}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Print
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 font-medium mb-2">Lesvoorbereiding wordt gegenereerd...</p>
              <p className="text-gray-500 text-sm">Dit kan even duren, even geduld</p>
            </div>
          </div>
        ) : lessonPrep ? (
          <div className="p-8">
            <div id="lesson-prep-content" className="space-y-6">
              {formatLessonPrepAdvanced(lessonPrep, copyToClipboard, copiedSection)}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-full p-8 mb-6">
              <svg className="w-20 h-20 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Klaar om te beginnen?</h3>
            <p className="text-gray-600 max-w-md">Vul het formulier links in om een gepersonaliseerde lesvoorbereiding te genereren voor je leerling.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function formatLessonPrepAdvanced(text: string, copyToClipboard: (text: string, section: string) => void, copiedSection: string | null): JSX.Element {
  const sections = text.split(/(?=##\s)/)
  
  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        if (!section.trim()) return null
        
        const lines = section.trim().split('\n')
        const title = lines[0]?.replace(/^#+\s*/, '') || ''
        const content = lines.slice(1).join('\n')
        
        // Determine section type and styling
        const getSectionConfig = (title: string) => {
          const titleLower = title.toLowerCase()
          if (titleLower.includes('warming') || titleLower.includes('warm')) {
            return { 
              icon: '🔥', 
              color: 'bg-orange-50 border-orange-200', 
              headerColor: 'text-orange-700',
              timing: '10 min'
            }
          }
          if (titleLower.includes('technische') || titleLower.includes('oefening')) {
            return { 
              icon: '🎯', 
              color: 'bg-blue-50 border-blue-200', 
              headerColor: 'text-blue-700',
              timing: '15 min'
            }
          }
          if (titleLower.includes('repertoire')) {
            return { 
              icon: '🎵', 
              color: 'bg-green-50 border-green-200', 
              headerColor: 'text-green-700',
              timing: '20 min'
            }
          }
          if (titleLower.includes('afsluiting') || titleLower.includes('huiswerk')) {
            return { 
              icon: '📝', 
              color: 'bg-purple-50 border-purple-200', 
              headerColor: 'text-purple-700',
              timing: '5 min'
            }
          }
          if (titleLower.includes('aandachtspunten')) {
            return { 
              icon: '💡', 
              color: 'bg-yellow-50 border-yellow-200', 
              headerColor: 'text-yellow-700',
              timing: ''
            }
          }
          return { 
            icon: '📋', 
            color: 'bg-gray-50 border-gray-200', 
            headerColor: 'text-gray-700',
            timing: ''
          }
        }
        
        const config = getSectionConfig(title)
        const sectionId = `section-${index}`
        
        return (
          <div key={index} className={`border-2 ${config.color} rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{config.icon}</span>
                <h3 className={`text-xl font-bold ${config.headerColor}`}>{title}</h3>
                {config.timing && (
                  <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600 shadow-sm">
                    {config.timing}
                  </span>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(section, sectionId)}
                className={`text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-white/70 transition-colors duration-200 ${copiedSection === sectionId ? 'text-green-600' : ''}`}
                title="Kopieer dit onderdeel"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            <div className="prose prose-sm max-w-none">
              <div dangerouslySetInnerHTML={{ __html: formatContent(content) }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatContent(content: string): string {
  let formatted = content
    // Convert bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800 bg-yellow-100 px-1 rounded">$1</strong>')
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em class="text-gray-700">$1</em>')
    // Convert bullet points
    .replace(/^- (.*?)$/gm, '<li class="mb-2 text-gray-700">$1</li>')
    // Convert numbered lists
    .replace(/^\d+\. (.*?)$/gm, '<li class="mb-2 text-gray-700">$1</li>')
    
  // Wrap consecutive list items in ul/ol tags
  formatted = formatted.replace(/(^<li class="mb-2 text-gray-700">.*?<\/li>\n)+/gm, (match) => {
    return `<ul class="list-disc list-inside mb-4 space-y-1 ml-4">${match}</ul>`
  })
  
  // Add paragraph tags to remaining text blocks
  formatted = formatted.replace(/^(?!<[hulo])(.+)$/gm, '<p class="mb-3 text-gray-700 leading-relaxed">$1</p>')
  
  return formatted
}