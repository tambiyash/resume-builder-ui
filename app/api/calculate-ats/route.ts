import { calcATSSystemInstructions, calcATSUserInstructions } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeData, jobUrl, jobDescription } = body

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      )
    }

    if (!jobUrl && !jobDescription) {
      return NextResponse.json(
        { error: 'Either job URL or job description is required' },
        { status: 400 }
      )
    }

    let jobContent = ''

    // If job URL is provided, crawl it
    if (jobUrl) {
      try {
        const response = await fetch(jobUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; ResumeBuilder/1.0)',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch job posting')
        }

        const html = await response.text()
        
        // Basic HTML text extraction (strips tags)
        const textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()

        jobContent = textContent.slice(0, 5000) // Limit to first 5000 chars
      } catch (err) {
        console.error('Error fetching job URL:', err)
        return NextResponse.json(
          { error: 'Failed to fetch job posting from URL. Please try using job description instead.' },
          { status: 400 }
        )
      }
    } else {
      jobContent = jobDescription as string
    }

    // Call OpenAI to calculate ATS score
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: calcATSSystemInstructions,
        },
        {
          role: 'user',
          content: calcATSUserInstructions(JSON.stringify(resumeData, null, 2), jobContent),
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1500,
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content?.trim()
    
    if (!responseText) {
      throw new Error('No response from AI')
    }

    const atsAnalysis = JSON.parse(responseText)

    console.log('ATS Analysis:', JSON.stringify(atsAnalysis, null, 2))

    return NextResponse.json({
      success: true,
      analysis: atsAnalysis,
    })
  } catch (error: any) {
    console.error('Error calculating ATS score:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to calculate ATS score' },
      { status: 500 }
    )
  }
}

