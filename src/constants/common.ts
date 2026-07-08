export const USER_TYPE = {
    INSTITUTIONAL_CAREER_ARCHITECT: 'Institutional Career Architect',
    CAREER_ARCHITECT: 'Career Architect',
    MENTOR: 'Mentor',
  } as const;
  
  export type UserTypeValue = (typeof USER_TYPE)[keyof typeof USER_TYPE];