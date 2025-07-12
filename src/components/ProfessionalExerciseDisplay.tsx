'use client'

import { useState } from 'react'
import { generateTextPDF } from '@/utils/pdfGenerator'
import EditableContent from '@/components/EditableContent'

interface ExerciseSection {
  title: string
  icon: string
  color: string
  bgColor: string
  borderColor: string
  timing?: string
  content: string
}

interface ProfessionalExerciseDisplayProps {
  exerciseScheme: string
  isLoading: boolean
  studentName?: string
  onContentChange?: (newContent: string) => void
}

// Simple content formatter for exercise scheme content
function formatExerciseContent(content: string): string {
  if (!content || typeof content !== 'string') return ''
  
  let formatted = content
    // Remove excessive markdown asterisks and clean up formatting
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
    
    // Clean bullet points - remove extra asterisks
    .replace(/^[\*\-]\s*/gm, '• ')
    .replace(/^(\d+)\.\s*/gm, '$1. ')
    
    // Convert simple bullet points to proper HTML
    .replace(/^• (.+)$/gm, '<li class="mb-1 text-gray-700">$1</li>')
    .replace(/^(\d+\. .+)$/gm, '<li class="mb-1 text-gray-700">$1</li>')
  
  // Wrap consecutive list items
  formatted = formatted.replace(/(^<li class="mb-1 text-gray-700">.*?<\/li>\n?)+/gm, (match) => {
    return `<ul class="list-disc list-inside mb-3 ml-4 space-y-1">${match}</ul>`
  })
  
  // Convert paragraphs
  formatted = formatted
    .split('\n\n')
    .map(paragraph => {
      const trimmed = paragraph.trim()
      if (!trimmed || trimmed.match(/^<[uo]l/)) return trimmed
      return `<p class="mb-3 text-gray-700 leading-relaxed">${trimmed}</p>`
    })
    .filter(p => p.length > 0)
    .join('\n')
  
  return formatted
}

export default function ProfessionalExerciseDisplay({ 
  exerciseScheme, 
  isLoading, 
  studentName, 
  onContentChange 
}: ProfessionalExerciseDisplayProps) {
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

  const parseExerciseScheme = (content: string): ExerciseSection[] => {
    if (!content) return []

    const sections: ExerciseSection[] = []
    const lines = content.split('\n')
    let currentSection: ExerciseSection | null = null
    let currentContent: string[] = []

    const getSectionConfig = (title: string) => {
      const titleLower = title.toLowerCase()
      if (titleLower.includes('opwarming') || titleLower.includes('warming')) {
        return { icon: '🔥', color: 'from-orange-400 to-red-400', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' }
      }
      if (titleLower.includes('techniek') || titleLower.includes('oefening')) {
        return { icon: '🎯', color: 'from-blue-400 to-indigo-400', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
      }
      if (titleLower.includes('repertoire')) {
        return { icon: '🎵', color: 'from-green-400 to-emerald-400', bgColor: 'bg-green-50', borderColor: 'border-green-200' }
      }
      if (titleLower.includes('afsluiting') || titleLower.includes('huiswerk')) {
        return { icon: '📝', color: 'from-purple-400 to-violet-400', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' }
      }
      if (titleLower.includes('week') || titleLower.includes('planning')) {
        return { icon: '📅', color: 'from-indigo-400 to-purple-400', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' }
      }
      if (titleLower.includes('introductie') || titleLower.includes('inleiding')) {
        return { icon: '🎯', color: 'from-emerald-400 to-teal-400', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' }
      }
      return { icon: '💡', color: 'from-yellow-400 to-amber-400', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      // Check for section headers
      if (line.match(/^#+\s+/) || line.match(/^\*\*.*?\*\*/) || line.match(/^[0-9]+\./)) {
        // Save previous section
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim()
          sections.push(currentSection)
        }

        // Start new section
        let title = line.replace(/^#+\s*/, '').replace(/^\*\*(.*?)\*\*/, '$1').replace(/^[0-9]+\.\s*/, '')
        
        // Extract timing from title if present
        const timingMatch = title.match(/\(([^)]+)\)/)
        const timing = timingMatch ? timingMatch[1] : undefined
        title = title.replace(/\s*\([^)]+\)/, '')

        const config = getSectionConfig(title)
        currentSection = {
          title,
          timing,
          icon: config.icon,
          color: config.color,
          bgColor: config.bgColor,
          borderColor: config.borderColor,
          content: ''
        }
        currentContent = []
      } else if (line && currentSection) {
        currentContent.push(line)
      } else if (line && !currentSection) {
        // Content before any section - filter out teacher-oriented content
        const lineText = line.trim().toLowerCase()
        
        // Skip teacher-oriented content
        const teacherPhrases = [
          'als ervaren zangpedagoog',
          'begrijp ik hoe belangrijk',
          'dit schema is ontworpen',
          'hier is het persoonlijke',
          'absoluut!',
          'ik begrijp',
          'laten we',
          'dit is een goede',
          'perfect!',
          'uitstekend!',
          'geweldig dat',
          'ik help je graag'
        ]
        
        const isTeacherContent = teacherPhrases.some(phrase => lineText.includes(phrase))
        
        // Only create general section if there's meaningful student-oriented content
        if (line.trim().length > 0 && !isTeacherContent && lineText.length > 20) {
          const config = getSectionConfig('Algemeen')
          currentSection = {
            title: 'Algemene informatie',
            icon: config.icon,
            color: config.color,
            bgColor: config.bgColor,
            borderColor: config.borderColor,
            content: ''
          }
          currentContent = [line]
        }
      }
    }

    // Add final section
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim()
      if (currentSection.content.length > 0) {
        sections.push(currentSection)
      }
    }

    // Filter out sections with empty, meaningless, or teacher-oriented content
    const filteredSections = sections.filter(section => {
      const content = section.content.trim().toLowerCase()
      
      // Filter out empty content
      if (content.length === 0) return false
      
      // Filter out teacher-oriented content in general info sections
      if (section.title === 'Algemene informatie') {
        const teacherPhrases = [
          'als ervaren zangpedagoog',
          'begrijp ik hoe belangrijk',
          'dit schema is ontworpen',
          'hier is het persoonlijke',
          'absoluut!',
          'ik begrijp',
          'laten we',
          'dit is een goede',
          'perfect!',
          'uitstekend!',
          'geweldig dat',
          'ik help je graag',
          'hier is het schema',
          'voor marcel',
          'voor jou'
        ]
        
        const hasTeacherContent = teacherPhrases.some(phrase => content.includes(phrase))
        if (hasTeacherContent) return false
        
        // General info must have substantial, meaningful content
        return content.length > 30
      }
      
      // Keep all other sections with any content
      return content.length > 0
    })
    
    // Sort sections to put introduction first
    return filteredSections.sort((a, b) => {
      if (a.title.toLowerCase().includes('introductie')) return -1
      if (b.title.toLowerCase().includes('introductie')) return 1
      return 0
    })
  }

  const sections = parseExerciseScheme(exerciseScheme)

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
          <h2 className="text-2xl font-bold">Oefenschema</h2>
          <p className="text-green-100 text-sm">Gepersonaliseerd huiswerk schema</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-200 border-t-green-500 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Oefenschema wordt gemaakt...</h3>
            <p className="text-gray-600">Even geduld, we maken een gepersonaliseerd schema</p>
          </div>
        </div>
      </div>
    )
  }

  if (!exerciseScheme) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white">
          <h2 className="text-2xl font-bold">Oefenschema</h2>
          <p className="text-green-100 text-sm">Gepersonaliseerd huiswerk schema</p>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-full p-8 mb-6 mx-auto w-32 h-32 flex items-center justify-center">
              <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 15l4-4 4 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Klaar voor huiswerk?</h3>
            <p className="text-gray-600 text-lg">Vul het formulier links in om een gepersonaliseerd oefenschema te genereren gebaseerd op de lesvoorbereiding.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full flex flex-col">
      {/* Elegant Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold mb-1">Oefenschema</h2>
            <p className="text-green-100 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {studentName || 'Gepersonaliseerd schema'}
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => copyToClipboard(exerciseScheme, 'full')}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              {copiedSection === 'full' ? 'Gekopieerd!' : 'Kopieer'}
            </button>
            
            <button
              onClick={generateShareLink}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              {copiedSection === 'share-link' ? 'Link gekopieerd!' : 'Deel'}
            </button>

            <button
              onClick={handlePDFExport}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {sections.length > 0 ? (
          <div className="p-8 space-y-6">
            {/* Timeline Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Oefening Overzicht</h3>
                <span className="text-sm text-gray-500">
                  {sections.filter(s => s.timing).length} onderdelen
                </span>
              </div>
              <div className="flex space-x-2">
                {sections.filter(s => s.timing).map((section, index) => (
                  <div key={index} className="flex-1">
                    <div className={`h-2 rounded-full bg-gradient-to-r ${section.color}`}></div>
                    <div className="text-xs text-center mt-1 text-gray-600">
                      {section.timing}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exercise Cards */}
            <div className="space-y-6">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`${section.bgColor} border-2 ${section.borderColor} rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${section.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {section.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-800">{section.title}</h4>
                        {section.timing && (
                          <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full font-medium shadow-sm">
                            ⏱️ {section.timing}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => copyToClipboard(section.content, `section-${index}`)}
                      className={`text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-white/70 transition-colors duration-200 ${
                        copiedSection === `section-${index}` ? 'text-green-600' : ''
                      }`}
                      title="Kopieer dit onderdeel"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <EditableContent
                      content={section.content}
                      onSave={(newContent) => {
                        // Update this section in the full exercise scheme
                        const updatedScheme = exerciseScheme.replace(section.content, newContent)
                        onContentChange?.(updatedScheme)
                      }}
                      className="bg-white/50 rounded-lg p-4 min-h-[100px]"
                      placeholder="Oefeningen voor dit onderdeel..."
                      renderMode="formatted"
                      formatFunction={formatExerciseContent}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-8">
            <EditableContent
              content={exerciseScheme}
              onSave={(newContent) => onContentChange?.(newContent)}
              className="min-h-[400px] bg-gray-50 rounded-2xl p-6"
              placeholder="Oefenschema..."
            />
          </div>
        )}

        {/* Share Link Display */}
        {shareId && (
          <div className="mx-8 mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl">
            <div className="flex items-start space-x-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 mb-2">Deel-link gegenereerd!</h4>
                <p className="text-sm text-green-700 mb-3">Je kunt dit oefenschema nu delen met de leerling via:</p>
                <div className="bg-white p-4 rounded-xl border border-green-200 font-mono text-sm break-all">
                  {typeof window !== 'undefined' && `${window.location.origin}/share/${shareId}`}
                </div>
                <p className="text-xs text-green-600 mt-2">✓ Link is gekopieerd naar je klembord</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}