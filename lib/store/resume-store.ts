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
  skills: string[]
  languages: string[]
  certificates: string[]
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
  setSkills: (skills: string[]) => void
  
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
    title: "Product Designer",
    email: "johndoe@example.com",
    phone: "+1 555 012345",
    location: "San Francisco, CA",
    summary:
      "Human-centered designer with 6+ years crafting clear, accessible interfaces across web and mobile. I translate research into product strategy and deliver pragmatic, system‑minded solutions.",
  },
  experience: [
    {
      company: "Acme Corp",
      role: "Senior Product Designer",
      start: "2022",
      end: "Present",
      bullets: [
        "Led redesign of checkout, improving conversion by 12%",
        "Built design tokens and components enabling faster iteration",
      ],
    },
    {
      company: "Northwind",
      role: "Product Designer",
      start: "2019",
      end: "2022",
      bullets: ["Shipped onboarding flows", "Ran usability testing across 3 product areas"],
    },
  ],
  education: [{ school: "State University", degree: "B.S. in HCI", start: "2014", end: "2018" }],
  skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],
  languages: ["English", "Spanish"],
  certificates: ["NN/g UX Certification"],
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
      setSkills: (skills) =>
        set((state) => ({
          resume: { ...state.resume, skills },
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
        set((state) => ({
          resume: { ...state.resume, ...data },
        })),

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
    setSkills: state.setSkills,
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

