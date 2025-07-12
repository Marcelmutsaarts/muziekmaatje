'use client'

import { useState } from 'react'
import { generatePDF, generateTextPDF } from '@/utils/pdfGenerator'
import EditableContent from '@/components/EditableContent'

interface ExerciseSchemeDisplayProps {
  exerciseScheme: string
  isLoading: boolean
  studentName?: string
  onContentChange?: (newContent: string) => void
}

export default function ExerciseSchemeDisplay({ exerciseScheme, isLoading, studentName, onContentChange }: ExerciseSchemeDisplayProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)
  const [shareId, setShareId] = useState<string | null>(null)

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(section)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handlePDFExport = async () => {
    generateTextPDF(exerciseScheme, {
      title: 'Oefenschema',
      studentName: studentName,
      type: 'exercise-scheme'
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const generateShareLink = () => {
    const id = Math.random().toString(36).substr(2, 9)
    localStorage.setItem(`exercise-scheme-${id}`, exerciseScheme)
    setShareId(id)
    
    const shareUrl = `${window.location.origin}/share/${id}`
    copyToClipboard(shareUrl, 'share-link')
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">
      {/* Header with actions */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Oefenschema</h2>
            <p className="text-green-100 text-sm">Gepersonaliseerd huiswerk schema</p>
          </div>
          {exerciseScheme && (
            <div className="flex space-x-2">
              <button
                onClick={() => copyToClipboard(exerciseScheme, 'full')}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copiedSection === 'full' ? 'Gekopieerd!' : 'Kopieer'}
              </button>
              <button
                onClick={generateShareLink}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                {copiedSection === 'share-link' ? 'Link gekopieerd!' : 'Deel'}
              </button>
              <button
                onClick={handlePDFExport}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={handlePrint}
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
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-200 border-t-green-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                </svg>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600 font-medium mb-2">Oefenschema wordt gegenereerd...</p>
              <p className="text-gray-500 text-sm">Even geduld, we maken een gepersonaliseerd schema</p>
            </div>
          </div>
        ) : exerciseScheme ? (
          <div className="p-8">
            <div id="exercise-scheme-content" className="space-y-6">
              <EditableContent
                content={exerciseScheme}
                onSave={(newContent) => {
                  onContentChange?.(newContent)
                }}
                className="min-h-[200px]"
                placeholder="Oefenschema..."
              />
              
              {/* Hidden formatted version for PDF export */}
              <div className="hidden print:block">
                {formatExerciseSchemeAdvanced(exerciseScheme, copyToClipboard, copiedSection)}
              </div>
            </div>
            
            {shareId && (
              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-green-800 mb-1">Deel-link gegenereerd!</h4>
                    <p className="text-sm text-green-700 mb-2">Je kunt dit oefenschema nu delen met de leerling via:</p>
                    <div className="bg-white p-3 rounded border border-green-200 font-mono text-sm">
                      {window.location.origin}/share/{shareId}
                    </div>
                    <p className="text-xs text-green-600 mt-2">Link is gekopieerd naar je klembord</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-full p-8 mb-6">
              <svg className="w-20 h-20 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 15l4-4 4 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Klaar voor huiswerk?</h3>
            <p className="text-gray-600 max-w-md">Vul het formulier links in om een gepersonaliseerd oefenschema te genereren gebaseerd op de lesvoorbereiding.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function formatExerciseSchemeAdvanced(text: string, copyToClipboard: (text: string, section: string) => void, copiedSection: string | null): JSX.Element {
  const sections = text.split(/(?=##\s)/)
  
  return (
    <div className="space-y-8">
      {sections.map((section, index) => {
        if (!section.trim()) return null
        
        const lines = section.trim().split('\n')
        const title = lines[0]?.replace(/^#+\s*/, '') || ''
        const content = lines.slice(1).join('\n')
        
        // Determine section type and styling for exercise schemes
        const getSectionConfig = (title: string) => {
          const titleLower = title.toLowerCase()
          if (titleLower.includes('dagelijkse') || titleLower.includes('planning')) {
            return { 
              icon: '📅', 
              color: 'bg-blue-50 border-blue-200', 
              headerColor: 'text-blue-700',
              timing: ''
            }
          }
          if (titleLower.includes('weekoverzicht') || titleLower.includes('week')) {
            return { 
              icon: '📊', 
              color: 'bg-purple-50 border-purple-200', 
              headerColor: 'text-purple-700',
              timing: ''
            }
          }
          if (titleLower.includes('tips') || titleLower.includes('belangrijk')) {
            return { 
              icon: '💡', 
              color: 'bg-yellow-50 border-yellow-200', 
              headerColor: 'text-yellow-700',
              timing: ''
            }
          }
          if (titleLower.includes('let op') || titleLower.includes('waarschuw')) {
            return { 
              icon: '⚠️', 
              color: 'bg-orange-50 border-orange-200', 
              headerColor: 'text-orange-700',
              timing: ''
            }
          }
          if (titleLower.includes('oefenschema')) {
            return { 
              icon: '🏠', 
              color: 'bg-green-50 border-green-200', 
              headerColor: 'text-green-700',
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
        const sectionId = `exercise-section-${index}`
        
        return (
          <div key={index} className={`border-2 ${config.color} rounded-xl p-6 transition-all duration-200 hover:shadow-lg`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{config.icon}</span>
                <h3 className={`text-xl font-bold ${config.headerColor}`}>{title}</h3>
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
              <div dangerouslySetInnerHTML={{ __html: formatExerciseContent(content) }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function formatExerciseContent(content: string): string {
  let formatted = content
    // Convert bold text with green highlighting for exercise schemes
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800 bg-green-100 px-1 rounded">$1</strong>')
    // Convert italic text
    .replace(/\*(.*?)\*/g, '<em class="text-gray-700">$1</em>')
    // Convert bullet points
    .replace(/^- (.*?)$/gm, '<li class="mb-2 text-gray-700">$1</li>')
    // Convert numbered lists
    .replace(/^\d+\. (.*?)$/gm, '<li class="mb-2 text-gray-700">$1</li>')
    
  // Special formatting for day-based content
  formatted = formatted.replace(/\*\*(Dag \d+[^*]*)\*\*/g, '<div class="bg-green-100 p-3 rounded-lg mb-3 border-l-4 border-green-500"><strong class="text-green-800">$1</strong></div>')
  
  // Special formatting for time-based activities
  formatted = formatted.replace(/\*\*(Opwarming|Techniek|Repertoire|Afsluiting)\*\*\s*\(([^)]+)\)/g, 
    '<div class="exercise-block bg-gray-50 p-4 rounded-lg mb-4 border-l-4 border-green-400">' +
    '<div class="flex items-center justify-between mb-2">' +
    '<h4 class="font-bold text-gray-800">$1</h4>' +
    '<span class="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">$2</span>' +
    '</div>')
    
  // Wrap consecutive list items in ul/ol tags
  formatted = formatted.replace(/(^<li class="mb-2 text-gray-700">.*?<\/li>\n)+/gm, (match) => {
    return `<ul class="list-disc list-inside mb-4 space-y-1 ml-4">${match}</ul>`
  })
  
  // Add paragraph tags to remaining text blocks
  formatted = formatted.replace(/^(?!<[hulo|div])(.+)$/gm, '<p class="mb-3 text-gray-700 leading-relaxed">$1</p>')
  
  return formatted
}