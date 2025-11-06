import { analyzeCVInstructions } from '@/lib/utils'
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'application/pdf',
    ]

    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload .doc, .docx, .txt, or .pdf' },
        { status: 400 }
      )
    }

    // Read file content as buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload file to OpenAI
    const uploaded = await openai.files.create({
      file: new File([buffer], file.name, { type: file.type }),
      purpose: 'assistants',
    })

    // Create assistant with file_search tool
    const assistant = await openai.beta.assistants.create({
      name: 'CV Parser',
      instructions: analyzeCVInstructions,
      model: 'gpt-4o-mini',
      tools: [{ type: 'file_search' }],
      response_format: { type: 'json_object' },
    })

    // Create a thread with the file attached
    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: 'Parse the attached CV and return the extracted information as JSON matching the structure provided in your instructions.',
          attachments: [
            {
              file_id: uploaded.id,
              tools: [{ type: 'file_search' }],
            },
          ],
        },
      ],
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
      assistant_id: assistant.id,
      max_completion_tokens: 2000,
    })

    console.log('Run status:', run.status)

    // Get the response
    let resumeData = null

    if (run.status === 'completed') {
      const messages = await openai.beta.threads.messages.list(thread.id)
      const assistantMessage = messages.data.find((msg) => msg.role === 'assistant')
      
      if (assistantMessage && assistantMessage.content[0]?.type === 'text') {
        const responseText = assistantMessage.content[0].text.value.trim()
        console.log('Raw response:', responseText)
        
        try {
          resumeData = JSON.parse(responseText)
          console.log('Parsed resume data:', JSON.stringify(resumeData, null, 2))
        } catch (parseError) {
          console.error('Failed to parse JSON response:', parseError)
          throw new Error('Failed to parse CV data')
        }
      } else {
        console.log('Failed to extract response - content type:', assistantMessage?.content[0]?.type)
        throw new Error('Invalid response format from AI')
      }
    } else {
      console.log('Run did not complete successfully. Status:', run.status)
      throw new Error(`CV parsing failed with status: ${run.status}`)
    }

    // Clean up: delete the file and assistant
    await openai.files.delete(uploaded.id)
    await openai.beta.assistants.delete(assistant.id)

    return NextResponse.json({
      success: true,
      data: resumeData,
      fileName: file.name,
      fileSize: file.size,
    })
  } catch (error: any) {
    console.error('Error analyzing CV:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to analyze CV' },
      { status: 500 }
    )
  }
}

