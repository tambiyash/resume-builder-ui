"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ResumeData } from "@/lib/store/resume-store"

type ResumePreviewModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  resumeData: ResumeData
  onConfirmDownload: () => void
  children: React.ReactNode
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-medium tracking-wide text-muted-foreground">{children}</h3>
}

export function ResumePreviewModal({
  open,
  onOpenChange,
  resumeData,
  onConfirmDownload,
  children,
}: ResumePreviewModalProps) {
  const [countdown, setCountdown] = useState(3)
  const [isDownloading, setIsDownloading] = useState(false)

  useEffect(() => {
    if (open && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (open && countdown === 0 && !isDownloading) {
      setIsDownloading(true)
      // Trigger download
      onConfirmDownload()
      // Close modal after a short delay
      setTimeout(() => {
        onOpenChange(false)
        setIsDownloading(false)
        setCountdown(3) // Reset for next time
      }, 1500)
    }
  }, [open, countdown, isDownloading, onConfirmDownload, onOpenChange])

  const handleClose = () => {
    onOpenChange(false)
    setCountdown(3) // Reset countdown
    setIsDownloading(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resume Preview</DialogTitle>
          <DialogDescription>
            Preview of how your resume will look in the PDF
          </DialogDescription>
        </DialogHeader>

        {/* Countdown/Download Message */}
        <div className="rounded-md border border-green-500/20 bg-green-500/10 px-4 py-3">
          <p className="text-sm leading-relaxed text-green-700 dark:text-green-400">
            {isDownloading ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 inline size-4 animate-spin"
                >
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Download starting...
              </>
            ) : (
              <>Download will start in {countdown} second{countdown !== 1 ? 's' : ''}...</>
            )}
          </p>
        </div>

        {/* Resume Preview - Full Width */}
        <div className="rounded-lg border bg-white p-8 shadow-sm">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}

