'use client'

interface LessonPrepDisplayProps {
  lessonPrep: string
  isLoading: boolean
}

export default function LessonPrepDisplay({ lessonPrep, isLoading }: LessonPrepDisplayProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Lesvoorbereiding
      </h2>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600">Lesvoorbereiding wordt gegenereerd...</p>
        </div>
      ) : lessonPrep ? (
        <div className="prose prose-purple max-w-none">
          <div 
            className="whitespace-pre-wrap text-gray-700"
            dangerouslySetInnerHTML={{ __html: formatLessonPrep(lessonPrep) }}
          />
        </div>
      ) : (
        <div className="text-center text-gray-500 py-12">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>Vul het formulier in om een lesvoorbereiding te genereren</p>
        </div>
      )}
    </div>
  )
}

function formatLessonPrep(text: string): string {
  // Convert markdown-style headers to HTML
  let formatted = text
    .replace(/^### (.*?)$/gm, '<h3 class="text-lg font-bold mt-6 mb-3 text-purple-700">$1</h3>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-8 mb-4 text-purple-800">$1</h2>')
    .replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-purple-900">$1</h1>')
    
  // Convert bold text
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
  
  // Convert italic text
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Convert bullet points
  formatted = formatted.replace(/^- (.*?)$/gm, '<li class="ml-4 mb-2">$1</li>')
  formatted = formatted.replace(/(<li.*?<\/li>\n)+/g, '<ul class="list-disc list-inside mb-4">$&</ul>')
  
  // Convert numbered lists
  formatted = formatted.replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 mb-2">$1</li>')
  formatted = formatted.replace(/(<li class="ml-4 mb-2">.*?<\/li>\n)+/g, '<ol class="list-decimal list-inside mb-4">$&</ol>')
  
  // Add paragraph tags to remaining text blocks
  formatted = formatted.replace(/^(?!<[h|u|o|l])(.+)$/gm, '<p class="mb-4">$1</p>')
  
  return formatted
}