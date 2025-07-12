'use client'

import { useState, useRef, useEffect } from 'react'

interface EditableContentProps {
  content: string
  onSave: (newContent: string) => void
  className?: string
  placeholder?: string
  renderMode?: 'plain' | 'formatted'
  formatFunction?: (content: string) => string
}

export default function EditableContent({ 
  content, 
  onSave, 
  className = '',
  placeholder = 'Begin met typen...',
  renderMode = 'plain',
  formatFunction
}: EditableContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [isEdited, setIsEdited] = useState(false)
  const [originalContent] = useState(content)
  const [currentContent, setCurrentContent] = useState(content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Only update if content has actually changed from an external source and we're not editing
    if (!isEditing && content !== currentContent) {
      setEditContent(content)
      setCurrentContent(content)
    }
  }, [content, isEditing, currentContent])

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      // Adjust height to content
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [isEditing])

  const handleSave = () => {
    onSave(editContent)
    setCurrentContent(editContent) // Update our tracking of current content
    setIsEditing(false)
    setIsEdited(editContent !== originalContent)
  }

  const handleCancel = () => {
    setEditContent(currentContent) // Use current content instead of prop content
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
    if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value)
    // Auto-resize
    e.target.style.height = 'auto'
    e.target.style.height = e.target.scrollHeight + 'px'
  }

  if (isEditing) {
    return (
      <div className={`${className} relative`}>
        <textarea
          ref={textareaRef}
          value={editContent}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          className="w-full p-4 border-2 border-blue-300 rounded-lg focus:border-blue-500 focus:outline-none resize-none overflow-hidden"
          placeholder={placeholder}
          style={{ minHeight: '200px' }}
        />
        
        {/* Edit Controls */}
        <div className="flex justify-end space-x-2 mt-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Annuleren
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Opslaan (Ctrl+S)
          </button>
        </div>
        
        {/* Help text */}
        <p className="text-xs text-gray-500 mt-2">
          Druk op Escape om te annuleren, of Ctrl+S om op te slaan
        </p>
      </div>
    )
  }

  return (
    <div className={`${className} relative group ${isEdited ? 'ring-2 ring-blue-300 ring-opacity-50' : ''}`}>
      {/* Edit indicator and button */}
      <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
        {isEdited && (
          <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-medium flex items-center opacity-100 group-hover:opacity-75 transition-opacity">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Bewerkt
          </div>
        )}
        
        <button
          onClick={() => setIsEditing(true)}
          className={`${isEdited ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100 bg-white/90 hover:bg-white p-2 rounded-lg shadow-md transition-all duration-200`}
          title="Bewerk inhoud"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
      
      {/* Content display */}
      <div className="cursor-pointer" onClick={() => setIsEditing(true)}>
        {currentContent ? (
          <div className={`${isEdited ? 'border-l-4 border-blue-400 pl-4' : ''}`}>
            {renderMode === 'formatted' && formatFunction ? (
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: formatFunction(currentContent) }}
              />
            ) : (
              <div className="whitespace-pre-wrap">{currentContent}</div>
            )}
          </div>
        ) : (
          <div className="text-gray-400 italic p-4">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}