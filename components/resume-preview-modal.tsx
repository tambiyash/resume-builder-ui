"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { ResumeData } from "@/lib/store/resume-store"

type ResumePreviewModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  resumeData: ResumeData
  onConfirmDownload: () => void
  children: React.ReactNode
}

export function ResumePreviewModal({
  open,
  onOpenChange,
  resumeData,
  onConfirmDownload,
  children,
}: ResumePreviewModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    setDownloadSuccess(false)
    try {
      await onConfirmDownload()
      setDownloadSuccess(true)
      // Auto-close modal after 2 seconds on success
      setTimeout(() => {
        onOpenChange(false)
        setDownloadSuccess(false)
      }, 2000)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] min-w-[800px] max-h-[95vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle>PDF Preview</DialogTitle>
              <DialogDescription>
                This is exactly how your resume will appear in the downloaded PDF
              </DialogDescription>
            </div>
            <Button
              onClick={handleDownload} 
              disabled={isDownloading || downloadSuccess}
              className="flex-shrink-0 mr-4"
            >
              {downloadSuccess ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 size-4"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Downloaded!
                </>
              ) : isDownloading ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 size-4 animate-spin"
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Downloading...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 size-4"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                  </svg>
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </DialogHeader>

        {/* PDF Preview with A4 pages - Scaled to fit */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div className="mx-auto space-y-4">
            {/* A4 Page Container - Scaled to fit modal */}
            <div 
              className="mx-auto bg-white shadow-lg origin-top"
              style={{
                width: '210mm',
                minHeight: '297mm',
                padding: '10mm',
                boxSizing: 'border-box',
                transform: 'scale(0.80)',
                marginBottom: '-20%', // Compensate for scale transform
              }}
            >
              {children}
            </div>
            
            {/* Info text below preview */}
            <p className="text-center text-sm text-muted-foreground">
              Preview: Page 1 • A4 Size (210mm × 297mm) • 10mm margins • Text-based PDF
            </p>
            <p className="text-center text-xs text-muted-foreground mt-1">
              Note: Scaled to 80% for preview. Actual PDF may span multiple pages based on content length.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

