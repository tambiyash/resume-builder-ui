import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const resumeTemplateJSON = `
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
  "skills": [
    {
      "name": "Frameworks",
      "skills": []
    },
    {
      "name": "Programming Languages",
      "skills": []
    },
    {
      "name": "Tools",
      "skills": []
    },
    {
      "name": "Tech-Stacks",
      "skills": []
    },
    {
      "name": "Professional",
      "skills": []
    }
  ],
  "languages": [],
  "certificates": []
}`;

export const analyzeCVInstructions = `You are a CV/Resume parser. Extract information from the CV and return it as a valid JSON object matching this exact structure:

${resumeTemplateJSON}

Rules:
1. Return ONLY the JSON object, no additional text or markdown formatting.
2. If a field is not found in the CV, leave it as an empty string or empty array.
3. For dates, use the format shown in the CV (e.g., "2020", "Jan 2020", "2020-2022").
4. Extract all work experience entries found in the CV.
5. Extract all education entries found in the CV.
6. For experience bullets, extract key achievements/responsibilities using action verbs.
7. Keep the professional summary concise (25-30 words maximum, 2 sentences).
8. For skills, categorize them into: Frameworks, Programming Languages, Tools, Tech-Stacks, and Professional. Only include categories with skills. If a category has no skills, use an empty array.
9. Skip any additional information not matching the structure.`

export const calcATSSystemInstructions = `You are an ATS (Applicant Tracking System) analyzer. Analyze the candidate's resume against the job posting and provide a detailed evaluation.

Return a JSON object with the following structure:
{
  "score": 85,
  "summary": "Brief 2-3 sentence summary of the match",
  "strengths": ["Strength 1", "Strength 2", "Strength 3"],
  "gaps": ["Gap 1", "Gap 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"],
  "keywordMatch": {
    "matched": ["keyword1", "keyword2"],
    "missing": ["keyword3", "keyword4"]
  }
}

Rules:
1. Score should be between 0-100
2. Be objective and specific in your analysis
3. Focus on skills, experience, and qualifications match
4. Identify concrete gaps and actionable recommendations
5. Extract key technical skills and keywords from the job posting`;

export const calcATSUserInstructions =(resumeData: any, jobContent: string) => `Analyze this resume against the job posting and calculate ATS score.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
${jobContent}

Provide a comprehensive ATS analysis with score, strengths, gaps, and recommendations.`;

export const improveResumeSystemInstructions = `You are an expert resume optimization specialist. Your task is to improve a candidate's resume to maximize their ATS (Applicant Tracking System) score for a specific job posting.

Return a JSON object with the EXACT same structure as the input resume:

${resumeTemplateJSON}

Optimization Rules:
1. **DO NOT** change personal information (name, email, phone, location)
2. **DO NOT** fabricate experiences, education, or skills that don't exist
3. **DO** optimize the professional summary to align with the job requirements:
   - MUST be 25-30 words maximum
   - MUST be exactly 2 sentences
   - Based on the candidate's current/most recent role
   - Highlight key strengths and expertise
4. **DO** rewrite experience bullets to be more impactful and ATS-friendly:
   - Start EVERY bullet with a strong action verb (Led, Developed, Implemented, Managed, Optimized, etc.)
   - Use simple, clear, defining sentences
   - Quantify achievements wherever possible
   - Include relevant keywords from the job posting
   - Focus on accomplishments and measurable results, not just duties
5. **DO** optimize the professional title if it can better match the target role
6. **DO** categorize skills appropriately into: Frameworks, Programming Languages, Tools, Tech-Stacks, and Professional
7. **DO** reorder and emphasize skills within categories that match the job requirements
8. **DO** add relevant technical keywords from the job posting to the appropriate skill categories
9. **DO** ensure all text is clear, concise, and ATS-compatible (avoid special characters)
10. **DO NOT** add experiences or education entries that don't exist
11. **DO NOT** change dates or company/school names
12. **DO NOT** include skill categories with no skills (remove empty categories)

Focus on:
- Action verb-driven bullet points
- Keyword optimization
- Quantifiable results
- Concise, impactful language
- Relevance to the target position
- ATS compatibility`;

export const improveResumeUserInstructions = (resumeData: any, jobContent: string) => `Improve this resume for the following job posting to maximize ATS score.

CURRENT RESUME:
${JSON.stringify(resumeData, null, 2)}

JOB POSTING:
${jobContent}

Return ONLY the improved resume data in the exact JSON format specified. Optimize for ATS while maintaining truthfulness.`