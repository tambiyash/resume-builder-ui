import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf'

export async function generateResumePDF(elementId: string, fileName: string = 'resume.pdf') {
  const element = document.getElementById(elementId)
  
  if (!element) {
    throw new Error('Resume element not found')
  }

  // A4 dimensions in mm
  const a4Width = 210
  const a4Height = 297
  
  // Create canvas from the resume element
  const canvas = await html2canvas(element, {
    scale: 2, // Higher scale for better quality
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: element.scrollWidth,
    windowHeight: element.scrollHeight,
  })

  const imgData = canvas.toDataURL('image/png')
  
  // Calculate dimensions to fit A4
  const imgWidth = a4Width
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  
  // Create PDF
  const pdf = new jsPDF({
    orientation: imgHeight > a4Width ? 'portrait' : 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  let heightLeft = imgHeight
  let position = 0

  // Add first page
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= a4Height

  // Add additional pages if content exceeds one page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= a4Height
  }

  // Download the PDF
  pdf.save(fileName)
}

/**
 * Alternative approach: Generate PDF with better layout control
 */
export async function generateOptimizedResumePDF(
  elementId: string, 
  fileName: string = 'resume.pdf'
) {
  const element = document.getElementById(elementId)
  
  if (!element) {
    throw new Error('Resume element not found')
  }

  // Clone the element to avoid modifying the original
  const clone = element.cloneNode(true) as HTMLElement
  
  // Apply A4 specific styling to the clone
  clone.style.width = '210mm'
  clone.style.minHeight = '297mm'
  clone.style.padding = '20mm' // Increased padding for better margins
  clone.style.paddingBottom = '25mm' // Extra bottom padding to prevent text cutoff
  clone.style.backgroundColor = '#ffffff'
  clone.style.position = 'absolute'
  clone.style.left = '-9999px'
  clone.style.top = '0'
  clone.style.boxSizing = 'border-box'
  
  document.body.appendChild(clone)

  try {
    // A4 dimensions in pixels at 96 DPI (standard screen resolution)
    const a4WidthPx = 794 // 210mm in pixels
    const a4HeightPx = 1123 // 297mm in pixels
    
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      width: a4WidthPx,
      windowWidth: a4WidthPx,
    })

    const imgData = canvas.toDataURL('image/png')
    
    // Create PDF in A4 format
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    const pageHeight = 297 // A4 height in mm
    const topMargin = 10 // Top margin for subsequent pages in mm
    const effectivePageHeight = pageHeight - topMargin // Available height on subsequent pages
    
    let heightLeft = imgHeight
    let position = 0
    let pageNumber = 0

    // Add first page (no top margin needed)
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    pageNumber++

    // Add additional pages with top margin
    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      // Add top margin to subsequent pages by offsetting the image position
      pdf.addImage(imgData, 'PNG', 0, position + topMargin, imgWidth, imgHeight)
      heightLeft -= effectivePageHeight
      pageNumber++
    }

    pdf.save(fileName)
  } finally {
    // Clean up the clone
    document.body.removeChild(clone)
  }
}

