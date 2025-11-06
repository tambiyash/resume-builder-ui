import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { resumeTemplateJSON } from '@/lib/utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const improveResumeSystemInstructions = `You are an expert resume writer and editor. Your task is to improve a candidate's resume based on their specific instructions.

Return a JSON object with the EXACT same structure as the input resume:

${resumeTemplateJSON}

Important Rules:
1. **DOUBLE QUOTES RULE**: Any text enclosed in double quotes ("text") in the user's instructions MUST be added exactly as written, word-for-word, without any modifications.
2. For text NOT in double quotes, you may modify it to sound more professional and polished.
3. **DO NOT** change personal information (name, email, phone, location) unless explicitly instructed.
4. **DO NOT** fabricate experiences, education, or skills that don't exist.
5. **DO** apply the user's requested changes accurately.
6. **DO** improve language to be professional, impactful, and ATS-friendly when not in quotes.
7. **DO** use strong action verbs for experience bullets (Led, Developed, Implemented, Managed, Optimized, etc.).
8. **DO** write simple, clear, defining sentences for experience descriptions.
9. **DO** quantify achievements where possible with specific numbers and metrics.
10. **DO NOT** add experiences or education entries that don't exist unless explicitly requested.
11. **DO NOT** change dates or company/school names unless explicitly instructed.
12. **DO** keep the professional summary concise:
    - 25-30 words maximum
    - Exactly 2 sentences
    - Based on current/most recent role (unless user specifies otherwise)
    - Highlight key strengths and expertise
13. Maintain truthfulness and accuracy in all modifications.

Focus on:
- Applying user instructions precisely
- Action verb-driven bullet points
- Professional tone (except for quoted text which stays as-is)
- Clear, concise, and impactful language
- ATS compatibility`

const improveResumeUserInstructions = (resumeData: any, userInstructions: string) => `Apply the following changes to the resume. Remember: text in double quotes should be used exactly as written.

CURRENT RESUME:
${JSON.stringify(resumeData, null, 2)}

USER INSTRUCTIONS:
${userInstructions}

Return ONLY the improved resume data in the exact JSON format specified. Apply the changes carefully, keeping quoted text exactly as provided.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resumeData, instructions } = body

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Resume data is required' },
        { status: 400 }
      )
    }

    if (!instructions || instructions.trim().length === 0) {
      return NextResponse.json(
        { error: 'Instructions are required' },
        { status: 400 }
      )
    }

    // Call OpenAI to improve the resume
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: improveResumeSystemInstructions,
        },
        {
          role: 'user',
          content: improveResumeUserInstructions(resumeData, instructions),
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
      message: 'Resume improved successfully',
    })
  } catch (error: any) {
    console.error('Error improving resume:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to improve resume' },
      { status: 500 }
    )
  }
}

