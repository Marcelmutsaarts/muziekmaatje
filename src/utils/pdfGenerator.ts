import jsPDF from 'jspdf'

interface PdfOptions {
  title: string
  studentName?: string
  type: 'lesson-prep' | 'exercise-scheme'
}

// Simple text-based PDF generation that works reliably
export function generateTextPDF(content: string, options: PdfOptions): void {
  try {
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 20
    const lineHeight = 7
    let yPosition = margin

    // Add header
    pdf.setFontSize(20)
    if (options.type === 'exercise-scheme') {
      pdf.setTextColor(22, 163, 74) // Green
    } else {
      pdf.setTextColor(124, 58, 237) // Purple
    }
    pdf.text(options.title, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 12

    if (options.studentName) {
      pdf.setFontSize(14)
      pdf.setTextColor(100, 100, 100)
      pdf.text(`Voor: ${options.studentName}`, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 10
    }

    pdf.setFontSize(10)
    pdf.setTextColor(150, 150, 150)
    const date = new Date().toLocaleDateString('nl-NL')
    pdf.text(`Gegenereerd op: ${date}`, pageWidth / 2, yPosition, { align: 'center' })
    yPosition += 20

    // Process content
    pdf.setFontSize(11)
    pdf.setTextColor(0, 0, 0)
    
    // Clean content - remove HTML tags and markdown
    const cleanContent = content
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
      .replace(/^#+\s*/gm, '') // Remove markdown headers
    
    const lines = cleanContent.split('\n')
    
    for (const line of lines) {
      // Check if we need a new page
      if (yPosition > pageHeight - margin - 20) {
        pdf.addPage()
        yPosition = margin + 10
      }

      if (line.trim()) {
        // Handle long lines by wrapping text
        const maxWidth = pageWidth - 2 * margin
        const words = line.trim().split(' ')
        let currentLine = ''
        
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word
          const textWidth = pdf.getTextWidth(testLine)
          
          if (textWidth > maxWidth && currentLine) {
            // Line is too long, print current line and start new one
            pdf.text(currentLine, margin, yPosition)
            yPosition += lineHeight
            currentLine = word
            
            // Check for new page after each line
            if (yPosition > pageHeight - margin - 20) {
              pdf.addPage()
              yPosition = margin + 10
            }
          } else {
            currentLine = testLine
          }
        }
        
        // Print remaining text
        if (currentLine) {
          pdf.text(currentLine, margin, yPosition)
          yPosition += lineHeight
        }
      } else {
        // Empty line - add small space
        yPosition += lineHeight / 2
      }
    }

    // Add footer
    pdf.setFontSize(8)
    pdf.setTextColor(150, 150, 150)
    pdf.text('MuziekMaatje - AI-assistent voor zangpedagogen', pageWidth / 2, pageHeight - 15, { align: 'center' })

    // Save the PDF
    const fileName = options.type === 'exercise-scheme' 
      ? `oefenschema_${options.studentName?.replace(/\s+/g, '_') || 'leerling'}_${date.replace(/\//g, '-')}.pdf`
      : `lesvoorbereiding_${date.replace(/\//g, '-')}.pdf`
    
    pdf.save(fileName)
  } catch (error) {
    console.error('Error generating PDF:', error)
    // Fallback to print dialog
    window.print()
    alert('PDF generatie mislukt. De browser print dialoog is geopend als alternatief.')
  }
}

// Legacy function for backward compatibility
export async function generatePDF(elementId: string, options: PdfOptions): Promise<void> {
  // For now, just call the text-based version
  const element = document.getElementById(elementId)
  if (element) {
    const content = element.innerText || element.textContent || ''
    generateTextPDF(content, options)
  }
}