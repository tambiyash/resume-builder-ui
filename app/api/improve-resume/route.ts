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
        
        // Basic HTML text extraction
        const textContent = html
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
          .replace(/<[^>]+>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()

        jobContent = textContent.slice(0, 5000)
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

    // Call OpenAI to improve the resume
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert resume optimization specialist. Your task is to improve a candidate's resume to maximize their ATS (Applicant Tracking System) score for a specific job posting.

Return a JSON object with the EXACT same structure as the input resume:

{
  "personal": {
    "fullName": "",
    "title": "",
    "email": "",
    "phone": "",
    "location": "",
    "summary": ""
  },
  "experience": [
    {
      "company": "",
      "role": "",
      "start": "",
      "end": "",
      "bullets": []
    }
  ],
  "education": [
    {
      "school": "",
      "degree": "",
      "start": "",
      "end": ""
    }
  ],
  "skills": [],
  "languages": [],
  "certificates": []
}

Optimization Rules:
1. **DO NOT** change personal information (name, email, phone, location)
2. **DO NOT** fabricate experiences, education, or skills that don't exist
3. **DO** optimize the professional summary to align with the job requirements
4. **DO** rewrite experience bullets to be more impactful and ATS-friendly:
   - Use strong action verbs
   - Quantify achievements where possible
   - Include relevant keywords from the job posting
   - Focus on accomplishments, not just duties
5. **DO** optimize the professional title if it can better match the target role
6. **DO** reorder and emphasize skills that match the job requirements
7. **DO** add relevant technical keywords from the job posting to skills (if applicable)
8. **DO** ensure all text is clear, concise, and ATS-compatible (avoid special characters)
9. **DO NOT** add experiences or education entries that don't exist
10. **DO NOT** change dates or company/school names

Focus on:
- Keyword optimization
- Action-oriented language
- Quantifiable results
- Relevance to the target position
- ATS compatibility`,
        },
        {
          role: 'user',
          content: `Improve this resume for the following job posting to maximize ATS score.

CURRENT RESUME:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
${jobContent}

Return ONLY the improved resume data in the exact JSON format specified. Optimize for ATS while maintaining truthfulness.`,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 3000,
      temperature: 0.7,
    })

    const responseText = completion.choices[0]?.message?.content?.trim()
    
    if (!responseText) {
      throw new Error('No response from AI')
    }

    const improvedResumeData = JSON.parse(responseText)

    console.log('Improved Resume Data:', JSON.stringify(improvedResumeData, null, 2))

    // Validate that the structure matches
    if (!improvedResumeData.personal || !improvedResumeData.experience || !improvedResumeData.education) {
      throw new Error('Invalid resume structure returned from AI')
    }

    return NextResponse.json({
      success: true,
      data: improvedResumeData,
      message: 'Resume optimized successfully for better ATS score',
    })
  } catch (error: any) {
    console.error('Error improving resume:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to improve resume' },
      { status: 500 }
    )
  }
}

