/** Where in the app an agreement can be shown (used to filter which agreement applies). */
export const AGREEMENT_TOUCHPOINTS = {
  CAREER_ARCHITECT_REGISTRATION: 'career_architect_registration',
  INSTITUTIONAL_CAREER_ARCHITECT_REGISTRATION: 'institutional_career_architect_registration',
  MENTOR_REGISTRATION: 'mentor_registration',
  BLUEPRINT_UPLOAD: 'blueprint_upload',
  CHECKOUT: 'checkout',
  MENTOR_PAYOUT_SETUP: 'mentor_payout_setup',
  NEWSLETTER: 'newsletter',
  CONTACT_FORM: 'contact_form',
  VERIFIED_MENTOR_APPLICATION: 'verified_mentor_application',
  UNIVERSITY_REGISTRATION: 'university_registration',
  AUDIO_VIDEO_MENTORING: 'audio_video_mentoring',
};

/** Dropdown/checkbox options for the touchpoint picker in the admin Agreements form. */
export const AGREEMENT_TOUCHPOINT_OPTIONS = [
  { value: AGREEMENT_TOUCHPOINTS.CAREER_ARCHITECT_REGISTRATION, label: 'Career Architect Registration' },
  { value: AGREEMENT_TOUCHPOINTS.INSTITUTIONAL_CAREER_ARCHITECT_REGISTRATION, label: 'Institutional Career Architect Registration' },
  { value: AGREEMENT_TOUCHPOINTS.MENTOR_REGISTRATION, label: 'Mentor Registration' },
  { value: AGREEMENT_TOUCHPOINTS.BLUEPRINT_UPLOAD, label: 'Blueprint Upload' },
  { value: AGREEMENT_TOUCHPOINTS.CHECKOUT, label: 'Checkout' },
  { value: AGREEMENT_TOUCHPOINTS.MENTOR_PAYOUT_SETUP, label: 'Mentor Payout Setup' },
  { value: AGREEMENT_TOUCHPOINTS.NEWSLETTER, label: 'Newsletter Signup' },
  { value: AGREEMENT_TOUCHPOINTS.CONTACT_FORM, label: 'Contact Form' },
  { value: AGREEMENT_TOUCHPOINTS.VERIFIED_MENTOR_APPLICATION, label: 'Verified Mentor Application' },
  { value: AGREEMENT_TOUCHPOINTS.UNIVERSITY_REGISTRATION, label: 'University Registration' },
  { value: AGREEMENT_TOUCHPOINTS.AUDIO_VIDEO_MENTORING, label: 'Audio/Video Mentoring' },
];

/** Which user types an agreement can be shown to. */
export const AGREEMENT_VISIBLE_USER_TYPES = {
  CAREER_ARCHITECT: 'Career Architect',
  INSTITUTIONAL_CA: 'Institutional Career Architect',
  MENTOR: 'Mentor',
};

/** Checkbox options for the "visible to" picker in the admin Agreements form. */
export const AGREEMENT_VISIBLE_USER_TYPE_OPTIONS = [
  { value: AGREEMENT_VISIBLE_USER_TYPES.CAREER_ARCHITECT, label: 'Career Architect' },
  { value: AGREEMENT_VISIBLE_USER_TYPES.INSTITUTIONAL_CA, label: 'Institutional Career Architect' },
  { value: AGREEMENT_VISIBLE_USER_TYPES.MENTOR, label: 'Mentor' },
];

export const AGREEMENT_STATUS_OPTIONS = ['active', 'inactive'];
