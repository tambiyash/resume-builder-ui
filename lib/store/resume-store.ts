import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

export type Experience = {
  company: string
  role: string
  start: string
  end: string
  bullets: string[]
}

export type Education = {
  school: string
  degree: string
  start: string
  end: string
}

export type SkillCategory = {
  name: string
  skills: string[]
}

export type PersonalInfo = {
  fullName: string
  title: string
  email: string
  phone: string
  location: string
  summary: string
}

export type ResumeData = {
  personal: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: SkillCategory[]
  languages: string[]
  certificates: string[]
}

// Helper function to migrate old skills format to new categorized format
function normalizeSkills(skills: any): SkillCategory[] {
  // If already in new format, return as is
  if (Array.isArray(skills) && skills.length > 0 && typeof skills[0] === 'object' && 'name' in skills[0]) {
    return skills as SkillCategory[]
  }
  
  // If old format (string array), convert to "Professional" category
  if (Array.isArray(skills) && skills.length > 0 && typeof skills[0] === 'string') {
    return [{ name: 'Professional', skills: skills as string[] }]
  }
  
  // Empty or invalid, return empty array
  return []
}

type ResumeStore = {
  resume: ResumeData
  
  // Personal info actions
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void
  setPersonalField: (field: keyof PersonalInfo, value: string) => void
  
  // Experience actions
  updateExperience: (index: number, experience: Partial<Experience>) => void
  addExperience: (experience: Experience) => void
  removeExperience: (index: number) => void
  
  // Education actions
  updateEducation: (index: number, education: Partial<Education>) => void
  addEducation: (education: Education) => void
  removeEducation: (index: number) => void
  
  // Skills actions
  updateSkillCategory: (index: number, category: Partial<SkillCategory>) => void
  addSkillCategory: (category: SkillCategory) => void
  removeSkillCategory: (index: number) => void
  
  // Languages actions
  setLanguages: (languages: string[]) => void
  
  // Certificates actions
  setCertificates: (certificates: string[]) => void
  
  // Import/Reset actions
  importResumeData: (data: Partial<ResumeData>) => void
  resetResume: () => void
}

const initialResumeData: ResumeData = {
  personal: {
    fullName: "John Doe",
    title: "Senior Product Designer",
    email: "johndoe@example.com",
    phone: "+1 555 012345",
    location: "San Francisco, CA",
    summary:
      "Product designer with 6+ years crafting accessible interfaces across web and mobile platforms. Translate user research into actionable product strategies delivering measurable business impact.",
  },
  experience: [
    {
      company: "Acme Corp",
      role: "Senior Product Designer",
      start: "2022",
      end: "Present",
      bullets: [
        "Led complete redesign of checkout flow, improving conversion rate by 12% and reducing cart abandonment by 18%",
        "Developed comprehensive design system with 50+ reusable components, accelerating product development by 30%",
        "Collaborated with engineering teams to implement responsive designs across web and mobile platforms",
      ],
    },
    {
      company: "Northwind",
      role: "Product Designer",
      start: "2019",
      end: "2022",
      bullets: [
        "Designed and launched user onboarding flows, increasing activation rate by 25%",
        "Conducted usability testing sessions across 3 product areas with 50+ participants",
        "Established design documentation standards adopted company-wide by 15+ designers",
      ],
    },
  ],
  education: [{ school: "State University", degree: "B.S. in Human-Computer Interaction", start: "2014", end: "2018" }],
  skills: [
    { name: "Frameworks", skills: ["React", "Angular", "Vue.js"] },
    { name: "Tools", skills: ["Figma", "Adobe XD", "Sketch", "InVision"] },
    { name: "Professional", skills: ["User Research", "Prototyping", "Design Systems", "Accessibility", "Wireframing", "User Testing", "Responsive Design"] },
  ],
  languages: ["English", "Spanish"],
  certificates: ["Nielsen Norman Group UX Certification"],
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: initialResumeData,

      // Personal info actions
      updatePersonalInfo: (info) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personal: { ...state.resume.personal, ...info },
          },
        })),

      setPersonalField: (field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            personal: { ...state.resume.personal, [field]: value },
          },
        })),

      // Experience actions
      updateExperience: (index, experience) =>
        set((state) => {
          const newExperience = [...state.resume.experience]
          newExperience[index] = { ...newExperience[index], ...experience }
          return {
            resume: { ...state.resume, experience: newExperience },
          }
        }),

      addExperience: (experience) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: [...state.resume.experience, experience],
          },
        })),

      removeExperience: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            experience: state.resume.experience.filter((_, i) => i !== index),
          },
        })),

      // Education actions
      updateEducation: (index, education) =>
        set((state) => {
          const newEducation = [...state.resume.education]
          newEducation[index] = { ...newEducation[index], ...education }
          return {
            resume: { ...state.resume, education: newEducation },
          }
        }),

      addEducation: (education) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: [...state.resume.education, education],
          },
        })),

      removeEducation: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            education: state.resume.education.filter((_, i) => i !== index),
          },
        })),

      // Skills actions
      updateSkillCategory: (index, category) =>
        set((state) => {
          const newSkills = [...state.resume.skills]
          newSkills[index] = { ...newSkills[index], ...category }
          return {
            resume: { ...state.resume, skills: newSkills },
          }
        }),

      addSkillCategory: (category) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: [...state.resume.skills, category],
          },
        })),

      removeSkillCategory: (index) =>
        set((state) => ({
          resume: {
            ...state.resume,
            skills: state.resume.skills.filter((_, i) => i !== index),
          },
        })),

      // Languages actions
      setLanguages: (languages) =>
        set((state) => ({
          resume: { ...state.resume, languages },
        })),

      // Certificates actions
      setCertificates: (certificates) =>
        set((state) => ({
          resume: { ...state.resume, certificates },
        })),

      // Import/Reset actions
      importResumeData: (data) =>
        set((state) => {
          // Normalize skills if present
          const normalizedData = { ...data }
          if (data.skills) {
            normalizedData.skills = normalizeSkills(data.skills)
          }
          return {
            resume: { ...state.resume, ...normalizedData },
          }
        }),

      resetResume: () =>
        set(() => ({
          resume: initialResumeData,
        })),
    }),
    {
      name: 'resume-storage',
      storage: createJSONStorage(() => {
        // Only use localStorage on client side
        if (typeof window !== 'undefined') {
          return localStorage
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      skipHydration: false,
    }
  )
)

// Efficient selectors
export const usePersonalInfo = () => useResumeStore((state) => state.resume.personal)
export const useExperience = () => useResumeStore((state) => state.resume.experience)
export const useEducation = () => useResumeStore((state) => state.resume.education)
export const useSkills = () => useResumeStore((state) => state.resume.skills)
export const useLanguages = () => useResumeStore((state) => state.resume.languages)
export const useCertificates = () => useResumeStore((state) => state.resume.certificates)

// Action selectors
export const usePersonalActions = () =>
  useResumeStore(useShallow((state) => ({
    updatePersonalInfo: state.updatePersonalInfo,
    setPersonalField: state.setPersonalField,
  })))

export const useExperienceActions = () =>
  useResumeStore(useShallow((state) => ({
    updateExperience: state.updateExperience,
    addExperience: state.addExperience,
    removeExperience: state.removeExperience,
  })))

export const useEducationActions = () =>
  useResumeStore(useShallow((state) => ({
    updateEducation: state.updateEducation,
    addEducation: state.addEducation,
    removeEducation: state.removeEducation,
  })))

export const useSkillsActions = () =>
  useResumeStore(useShallow((state) => ({
    updateSkillCategory: state.updateSkillCategory,
    addSkillCategory: state.addSkillCategory,
    removeSkillCategory: state.removeSkillCategory,
  })))

export const useLanguagesActions = () =>
  useResumeStore(useShallow((state) => ({
    setLanguages: state.setLanguages,
  })))

export const useCertificatesActions = () =>
  useResumeStore(useShallow((state) => ({
    setCertificates: state.setCertificates,
  })))

export const useImportActions = () =>
  useResumeStore(useShallow((state) => ({
    importResumeData: state.importResumeData,
    resetResume: state.resetResume,
  })))

