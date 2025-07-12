/**
 * Utility functions for extracting student names from lesson preparation content
 */

export function extractStudentName(content: string): string {
  if (!content) return ''

  // Common patterns for student names in lesson preparations
  const patterns = [
    // "Voor: [Name]" or "Voor [Name]"
    /(?:voor:?\s*)([A-Za-z\s]+?)(?:\n|$|,|\.|;)/i,
    
    // "Student: [Name]" or "Leerling: [Name]"
    /(?:student|leerling):?\s*([A-Za-z\s]+?)(?:\n|$|,|\.|;)/i,
    
    // "Naam: [Name]" or "Name: [Name]"
    /(?:naam|name):?\s*([A-Za-z\s]+?)(?:\n|$|,|\.|;)/i,
    
    // Look for names in the first few lines - often lesson preps start with the student name
    /^.*?([A-Z][a-z]+\s+[A-Z][a-z]+).*$/m,
    
    // "Lesvoorbereiding voor [Name]"
    /lesvoorbereiding\s+voor\s+([A-Za-z\s]+?)(?:\n|$|,|\.|;)/i,
    
    // "[Name] heeft..." or "[Name] is..."
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:heeft|is|kan|moet|wil)/m,
  ]

  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match && match[1]) {
      let name = match[1].trim()
      
      // Clean up the extracted name
      name = name
        .replace(/^(de|het|een|van|der|den)\s+/i, '') // Remove articles
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim()
      
      // Validate the name (should be 2-50 characters, letters and spaces only)
      if (name.length >= 2 && name.length <= 50 && /^[A-Za-z\s]+$/.test(name)) {
        // Capitalize first letter of each word
        return name.replace(/\b\w/g, l => l.toUpperCase())
      }
    }
  }

  return ''
}

/**
 * Extract student name specifically from lesson preparation form data
 */
export function extractStudentNameFromFormData(formData: {
  studentName?: string
  background?: string
  lessonGoal?: string
}): string {
  // First try the explicit student name field
  if (formData.studentName && formData.studentName.trim()) {
    return formData.studentName.trim()
  }

  // Then try to extract from background or lesson goal
  const textToSearch = [formData.background, formData.lessonGoal]
    .filter(Boolean)
    .join(' ')

  return extractStudentName(textToSearch)
}

/**
 * Extract student name from generated lesson preparation content
 */
export function extractStudentNameFromLessonPrep(lessonPrepContent: string): string {
  if (!lessonPrepContent) return ''

  // Look for patterns specific to generated lesson preparations
  const generatedPatterns = [
    // "## Lesvoorbereiding voor [Name]"
    /##\s*lesvoorbereiding\s+(?:voor\s+)?([A-Za-z\s]+?)(?:\n|$|\.)/i,
    
    // "# Lesvoorbereiding - [Name]"
    /#\s*lesvoorbereiding\s*-\s*([A-Za-z\s]+?)(?:\n|$|\.)/i,
    
    // "Lesvoorbereiding voor [Name]" without hash
    /lesvoorbereiding\s+voor\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i,
    
    // "Student: [Name]" in context
    /(?:student|leerling)\s*:\s*([A-Za-z]+(?:\s+[A-Za-z]+)?)/i,
    
    // Look for name patterns at the beginning of lesson content
    /^##?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*$/m,
    
    // Look for names followed by common lesson-related verbs
    /(?:^|\n|\.)?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s+(?:zal|moet|kan|gaat|heeft|is|wil|zou|ziet|voelt|vindt)/m,
    
    // Look for "Voor: [Name]" patterns
    /voor\s*:\s*([A-Za-z]+(?:\s+[A-Za-z]+)?)/i,
    
    // Names in first few lines of content
    /^.*?([A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?)\s+.*?(?:les|oefening|stem|zang)/im,
  ]

  for (const pattern of generatedPatterns) {
    const match = lessonPrepContent.match(pattern)
    if (match && match[1]) {
      let name = match[1].trim()
      
      // Clean up common false positives
      const commonWords = ['Lesvoorbereiding', 'Student', 'Leerling', 'Voor', 'Van', 'Het', 'De', 'Een', 'Door', 'Met']
      if (commonWords.some(word => name.toLowerCase().includes(word.toLowerCase()))) {
        continue
      }
      
      // Clean and validate
      name = name.replace(/\s+/g, ' ').trim()
      if (name.length >= 2 && name.length <= 50 && /^[A-Za-z\s]+$/.test(name)) {
        // Further validation: must look like a proper name
        if (name.split(' ').every(part => part.length >= 2 && /^[A-Z][a-z]+$/.test(part))) {
          return name.replace(/\b\w/g, l => l.toUpperCase())
        }
      }
    }
  }

  // Fallback to general extraction
  return extractStudentName(lessonPrepContent)
}