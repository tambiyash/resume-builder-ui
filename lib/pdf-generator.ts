/**
 * PDF Generation for Resume Builder
 * 
 * Using pdf-lib for true text-based PDFs with ATS optimization:
 * - Searchable and selectable text
 * - Smaller file sizes  
 * - Precise layout control
 * - Single-page optimized
 * - ATS-friendly formatting
 */

import { PDFDocument, StandardFonts, rgb, PDFPage, PDFFont } from 'pdf-lib'
import type { ResumeData } from '@/lib/store/resume-store'

// A4 dimensions in points (1 point = 1/72 inch)
const A4_WIDTH = 595.28
const A4_HEIGHT = 841.89

// Margins in points (10mm = ~28.35 points)
const MARGIN = 28.35
const USABLE_WIDTH = A4_WIDTH - (MARGIN * 2)
const USABLE_HEIGHT = A4_HEIGHT - (MARGIN * 2)

// Minimum space needed at bottom of page before creating new page
const MIN_SPACE_FOR_CONTENT = 40 // ~14mm

// Font sizes for ATS optimization (compact but readable)
const FONTS = {
  NAME: 18,
  TITLE: 11,
  SECTION_HEADER: 10,
  CONTACT: 8,
  BODY: 9,
  BODY_SMALL: 8.5,
}

// Line heights (compact)
const LINE_HEIGHT = {
  TIGHT: 1.2,
  NORMAL: 1.4,
  RELAXED: 1.5,
}

// Colors
const BLACK = rgb(0, 0, 0)
const DARK_GRAY = rgb(0.3, 0.3, 0.3)

// Helper to wrap text to fit width
function wrapText(text: string, maxWidth: number, font: PDFFont, fontSize: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const width = font.widthOfTextAtSize(testLine, fontSize)
    
    if (width <= maxWidth) {
      currentLine = testLine
    } else {
      if (currentLine) lines.push(currentLine)
      currentLine = word
    }
  }
  
  if (currentLine) lines.push(currentLine)
  return lines
}

// Helper function to draw section headers with underline
function drawSectionHeader(page: PDFPage, text: string, yPosition: number, font: PDFFont): number {
  page.drawText(text, {
    x: MARGIN,
    y: yPosition,
    size: FONTS.SECTION_HEADER,
    font: font,
    color: BLACK,
  })
  
  const headerY = yPosition - 2
  page.drawLine({
    start: { x: MARGIN, y: headerY },
    end: { x: A4_WIDTH - MARGIN, y: headerY },
    thickness: 0.75,
    color: BLACK,
  })
  
  return yPosition - FONTS.SECTION_HEADER * LINE_HEIGHT.TIGHT - 2
}

/**
 * Helper to check if we need a new page and create it if necessary
 */
function checkAndCreateNewPage(
  pdfDoc: PDFDocument,
  currentPage: PDFPage,
  yPosition: number,
  spaceNeeded: number
): { page: PDFPage; yPosition: number; pageCreated: boolean } {
  // Check if we have enough space
  if (yPosition - spaceNeeded < MARGIN) {
    // Create new page
    const newPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
    return {
      page: newPage,
      yPosition: A4_HEIGHT - MARGIN,
      pageCreated: true
    }
  }
  
  return {
    page: currentPage,
    yPosition,
    pageCreated: false
  }
}

/**
 * Generate ATS-optimized PDF resume using pdf-lib
 * Creates true text-based PDF with selectable text, compact layout, and multi-page support
 */
export async function generateOptimizedResumePDF(
  resumeData: ResumeData,
  fileName: string = 'resume.pdf'
) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create()
  let currentPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT])
  
  // Embed fonts
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
  
  let yPosition = A4_HEIGHT - MARGIN
  let pageCount = 1
  
  // HEADER SECTION - Name and Title (Centered) - Only on first page
  const nameWidth = fontBold.widthOfTextAtSize(resumeData.personal.fullName.toUpperCase(), FONTS.NAME)
  currentPage.drawText(resumeData.personal.fullName.toUpperCase(), {
    x: (A4_WIDTH - nameWidth) / 2,
    y: yPosition,
    size: FONTS.NAME,
    font: fontBold,
    color: BLACK,
  })
  yPosition -= FONTS.NAME * LINE_HEIGHT.TIGHT
  
  // Title
  if (resumeData.personal.title) {
    const titleWidth = fontRegular.widthOfTextAtSize(resumeData.personal.title, FONTS.TITLE)
    currentPage.drawText(resumeData.personal.title, {
      x: (A4_WIDTH - titleWidth) / 2,
      y: yPosition,
      size: FONTS.TITLE,
      font: fontRegular,
      color: BLACK,
    })
    yPosition -= FONTS.TITLE * LINE_HEIGHT.NORMAL + 2
  }
  
  // Contact info (Centered, horizontal layout)
  const contactParts: string[] = []
  if (resumeData.personal.email) contactParts.push(resumeData.personal.email)
  if (resumeData.personal.phone) contactParts.push(resumeData.personal.phone)
  if (resumeData.personal.location) contactParts.push(resumeData.personal.location)
  
  const contactLine = contactParts.join(' • ')
  const contactWidth = fontRegular.widthOfTextAtSize(contactLine, FONTS.CONTACT)
  currentPage.drawText(contactLine, {
    x: (A4_WIDTH - contactWidth) / 2,
    y: yPosition,
    size: FONTS.CONTACT,
    font: fontRegular,
    color: DARK_GRAY,
  })
  yPosition -= FONTS.CONTACT * LINE_HEIGHT.NORMAL + 8
  
  // Horizontal line under header
  currentPage.drawLine({
    start: { x: MARGIN, y: yPosition },
    end: { x: A4_WIDTH - MARGIN, y: yPosition },
    thickness: 1.5,
    color: BLACK,
  })
  yPosition -= 12
  
  // PROFESSIONAL SUMMARY
  if (resumeData.personal.summary) {
    // Check space for section header
    const headerSpace = FONTS.SECTION_HEADER * LINE_HEIGHT.TIGHT + 8
    let pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, headerSpace)
    currentPage = pageCheck.page
    yPosition = pageCheck.yPosition
    if (pageCheck.pageCreated) pageCount++
    
    yPosition = drawSectionHeader(currentPage, 'PROFESSIONAL SUMMARY', yPosition, fontBold)
    yPosition -= 6
    
    const summaryLines = wrapText(resumeData.personal.summary, USABLE_WIDTH, fontRegular, FONTS.BODY)
    for (const line of summaryLines) {
      // Check space for each line
      pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, FONTS.BODY * LINE_HEIGHT.NORMAL)
      currentPage = pageCheck.page
      yPosition = pageCheck.yPosition
      if (pageCheck.pageCreated) pageCount++
      
      currentPage.drawText(line, {
        x: MARGIN,
        y: yPosition,
        size: FONTS.BODY,
        font: fontRegular,
        color: BLACK,
      })
      yPosition -= FONTS.BODY * LINE_HEIGHT.NORMAL
    }
    yPosition -= 6
  }
  
  // WORK EXPERIENCE
  const headerSpace = FONTS.SECTION_HEADER * LINE_HEIGHT.TIGHT + 8
  let pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, headerSpace)
  currentPage = pageCheck.page
  yPosition = pageCheck.yPosition
  if (pageCheck.pageCreated) pageCount++
  
  yPosition = drawSectionHeader(currentPage, 'WORK EXPERIENCE', yPosition, fontBold)
  yPosition -= 6
  
  for (const exp of resumeData.experience) {
    // Check space for experience entry (company + role + at least one bullet)
    const expEntrySpace = (FONTS.BODY * LINE_HEIGHT.TIGHT) + (FONTS.BODY * LINE_HEIGHT.NORMAL) + (FONTS.BODY * LINE_HEIGHT.NORMAL * 2)
    pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, expEntrySpace)
    currentPage = pageCheck.page
    yPosition = pageCheck.yPosition
    if (pageCheck.pageCreated) pageCount++
    
    // Company name (bold)
    currentPage.drawText(exp.company, {
      x: MARGIN,
      y: yPosition,
      size: FONTS.BODY,
      font: fontBold,
      color: BLACK,
    })
    
    // Dates (right-aligned)
    const dateText = `${exp.start} – ${exp.end}`
    const dateWidth = fontRegular.widthOfTextAtSize(dateText, FONTS.BODY_SMALL)
    currentPage.drawText(dateText, {
      x: A4_WIDTH - MARGIN - dateWidth,
      y: yPosition,
      size: FONTS.BODY_SMALL,
      font: fontRegular,
      color: DARK_GRAY,
    })
    yPosition -= FONTS.BODY * LINE_HEIGHT.TIGHT
    
    // Role (italic)
    currentPage.drawText(exp.role, {
      x: MARGIN,
      y: yPosition,
      size: FONTS.BODY,
      font: fontItalic,
      color: BLACK,
    })
    yPosition -= FONTS.BODY * LINE_HEIGHT.NORMAL + 2
    
    // Bullets
    for (const bullet of exp.bullets) {
      // Bullet text (wrapped)
      const bulletLines = wrapText(bullet, USABLE_WIDTH - 16, fontRegular, FONTS.BODY)
      
      for (let i = 0; i < bulletLines.length; i++) {
        // Check space for each bullet line
        pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, FONTS.BODY * LINE_HEIGHT.NORMAL)
        currentPage = pageCheck.page
        yPosition = pageCheck.yPosition
        if (pageCheck.pageCreated) pageCount++
        
        // Bullet point (only on first line of each bullet)
        if (i === 0) {
          currentPage.drawText('•', {
            x: MARGIN + 4,
            y: yPosition,
            size: FONTS.BODY,
            font: fontRegular,
            color: BLACK,
          })
        }
        
        currentPage.drawText(bulletLines[i], {
          x: MARGIN + 16,
          y: yPosition,
          size: FONTS.BODY,
          font: fontRegular,
          color: BLACK,
        })
        yPosition -= FONTS.BODY * LINE_HEIGHT.NORMAL
      }
    }
    yPosition -= 4
  }
  yPosition -= 4
  
  // EDUCATION
  pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, headerSpace)
  currentPage = pageCheck.page
  yPosition = pageCheck.yPosition
  if (pageCheck.pageCreated) pageCount++
  
  yPosition = drawSectionHeader(currentPage, 'EDUCATION', yPosition, fontBold)
  yPosition -= 6
  
  for (const edu of resumeData.education) {
    // Check space for education entry
    const eduSpace = (FONTS.BODY * LINE_HEIGHT.TIGHT) + (FONTS.BODY * LINE_HEIGHT.NORMAL) + 4
    pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, eduSpace)
    currentPage = pageCheck.page
    yPosition = pageCheck.yPosition
    if (pageCheck.pageCreated) pageCount++
    
    // School name (bold)
    currentPage.drawText(edu.school, {
      x: MARGIN,
      y: yPosition,
      size: FONTS.BODY,
      font: fontBold,
      color: BLACK,
    })
    
    // Dates (right-aligned)
    const dateText = `${edu.start} – ${edu.end}`
    const dateWidth = fontRegular.widthOfTextAtSize(dateText, FONTS.BODY_SMALL)
    currentPage.drawText(dateText, {
      x: A4_WIDTH - MARGIN - dateWidth,
      y: yPosition,
      size: FONTS.BODY_SMALL,
      font: fontRegular,
      color: DARK_GRAY,
    })
    yPosition -= FONTS.BODY * LINE_HEIGHT.TIGHT
    
    // Degree
    currentPage.drawText(edu.degree, {
      x: MARGIN,
      y: yPosition,
      size: FONTS.BODY,
      font: fontRegular,
      color: BLACK,
    })
    yPosition -= FONTS.BODY * LINE_HEIGHT.NORMAL + 4
  }
  yPosition -= 4
  
  // SKILLS (Categorized)
  const skillsWithContent = resumeData.skills.filter(cat => cat.skills && cat.skills.length > 0)
  if (skillsWithContent.length > 0) {
    pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, headerSpace)
    currentPage = pageCheck.page
    yPosition = pageCheck.yPosition
    if (pageCheck.pageCreated) pageCount++
    
    yPosition = drawSectionHeader(currentPage, 'SKILLS', yPosition, fontBold)
    yPosition -= 6
    
    // Draw each skill category
    for (const category of skillsWithContent) {
      const categoryText = `${category.name}: ${category.skills.join(', ')}`
      const categoryLines = wrapText(categoryText, USABLE_WIDTH, fontRegular, FONTS.BODY)
      
      for (let i = 0; i < categoryLines.length; i++) {
        pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, FONTS.BODY * LINE_HEIGHT.NORMAL)
        currentPage = pageCheck.page
        yPosition = pageCheck.yPosition
        if (pageCheck.pageCreated) pageCount++
        
        const line = categoryLines[i]
        // Bold the category name (first line only, up to the colon)
        if (i === 0 && line.includes(':')) {
          const colonIndex = line.indexOf(':')
          const categoryName = line.substring(0, colonIndex + 1)
          const skillsList = line.substring(colonIndex + 1)
          
          // Draw category name in bold
          currentPage.drawText(categoryName, {
            x: MARGIN,
            y: yPosition,
            size: FONTS.BODY,
            font: fontBold,
            color: BLACK,
          })
          
          // Draw skills list in regular font
          const categoryWidth = fontBold.widthOfTextAtSize(categoryName, FONTS.BODY)
          currentPage.drawText(skillsList, {
            x: MARGIN + categoryWidth,
            y: yPosition,
            size: FONTS.BODY,
            font: fontRegular,
            color: BLACK,
          })
        } else {
          // Continuation lines (no category name)
          currentPage.drawText(line, {
            x: MARGIN,
            y: yPosition,
            size: FONTS.BODY,
            font: fontRegular,
            color: BLACK,
          })
        }
        yPosition -= FONTS.BODY * LINE_HEIGHT.NORMAL
      }
      yPosition -= 2 // Small gap between categories
    }
    yPosition -= 2
  }
  
  // LANGUAGES (if any)
  if (resumeData.languages && resumeData.languages.length > 0) {
    pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, headerSpace)
    currentPage = pageCheck.page
    yPosition = pageCheck.yPosition
    if (pageCheck.pageCreated) pageCount++
    
    yPosition = drawSectionHeader(currentPage, 'LANGUAGES', yPosition, fontBold)
    yPosition -= 6
    
    pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, FONTS.BODY * LINE_HEIGHT.NORMAL)
    currentPage = pageCheck.page
    yPosition = pageCheck.yPosition
    if (pageCheck.pageCreated) pageCount++
    
    const languagesText = resumeData.languages.join(' • ')
    currentPage.drawText(languagesText, {
      x: MARGIN,
      y: yPosition,
      size: FONTS.BODY,
      font: fontRegular,
      color: BLACK,
    })
    yPosition -= FONTS.BODY * LINE_HEIGHT.NORMAL + 4
  }
  
  // ACHIEVEMENTS/CERTIFICATES (if any)
  if (resumeData.certificates && resumeData.certificates.length > 0) {
    pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, headerSpace)
    currentPage = pageCheck.page
    yPosition = pageCheck.yPosition
    if (pageCheck.pageCreated) pageCount++
    
    yPosition = drawSectionHeader(currentPage, 'ACHIEVEMENT', yPosition, fontBold)
    yPosition -= 6
    
    for (const cert of resumeData.certificates) {
      // Certificate text
      const certLines = wrapText(cert, USABLE_WIDTH - 16, fontRegular, FONTS.BODY)
      
      for (let i = 0; i < certLines.length; i++) {
        pageCheck = checkAndCreateNewPage(pdfDoc, currentPage, yPosition, FONTS.BODY * LINE_HEIGHT.NORMAL)
        currentPage = pageCheck.page
        yPosition = pageCheck.yPosition
        if (pageCheck.pageCreated) pageCount++
        
        // Bullet point (only on first line)
        if (i === 0) {
          currentPage.drawText('•', {
            x: MARGIN + 4,
            y: yPosition,
            size: FONTS.BODY,
            font: fontRegular,
            color: BLACK,
          })
        }
        
        currentPage.drawText(certLines[i], {
          x: MARGIN + 16,
          y: yPosition,
          size: FONTS.BODY,
          font: fontRegular,
          color: BLACK,
        })
        yPosition -= FONTS.BODY * LINE_HEIGHT.NORMAL
      }
    }
  }
  
  // Save the PDF
  const pdfBytes = await pdfDoc.save()
  
  // Download the PDF
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
  
  console.log('PDF generated successfully with pdf-lib:', {
    pages: pageCount,
    totalPages: pdfDoc.getPages().length,
    size: 'A4 (210mm × 297mm)',
    margins: '10mm all sides',
    format: 'text-based (searchable)',
    fileSize: `${(pdfBytes.length / 1024).toFixed(1)}KB`
  })
}
