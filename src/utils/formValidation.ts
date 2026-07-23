import * as Yup from 'yup';
import { COUPON_SCOPES, COUPON_TYPES } from '@/constants/coupon';
import { BLUEPRINT_STATUSES } from '@/constants/blueprint';


const passwordRules = Yup.string()
  .min(8, 'Password must be at least 8 characters')
  .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .matches(/[0-9]/, 'Password must contain at least one number')
  .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character')
  .required('Password is required');


// Basic email shape: local + @ + domain with TLD (used for initial format check)
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

/**
 * Validates email with strict rules:
 * - Local: no leading/trailing dot or hyphen; no consecutive dots
 * - Domain: no label starting/ending with hyphen; no consecutive hyphens
 */
export function validateEmail(email: string): boolean {
  const trimmed = email.trim()
  if (!trimmed || !EMAIL_REGEX.test(trimmed)) return false

  const atIndex = trimmed.indexOf('@')
  const local = trimmed.slice(0, atIndex)
  const domain = trimmed.slice(atIndex + 1)

  // Local part: no leading/trailing dot or hyphen, no consecutive dots
  if (local.startsWith('.') || local.endsWith('.')) return false
  if (local.startsWith('-') || local.endsWith('-')) return false
  if (/\.\./.test(local)) return false

  // Domain: no consecutive dots (no empty labels)
  const labels = domain.split('.')
  if (labels.some((label) => label.length === 0)) return false

  // Each domain label: no leading/trailing hyphen, no consecutive hyphens
  for (const label of labels) {
    if (label.startsWith('-') || label.endsWith('-')) return false
    if (/--/.test(label)) return false
  }

  return true
}

const EMAIL_VALIDATION_MESSAGE = 'Please enter a valid email address'

const emailRules = Yup.string()
  .required('Email is required')
  .test('strict-email', EMAIL_VALIDATION_MESSAGE, (v) => !v || validateEmail(v))

// Sign In Validation Schema
export const signInSchema = Yup.object({
  email: emailRules,
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const signUpBaseSchema = {
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: emailRules,
  password: passwordRules,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
};

export const signUpSchema = Yup.object(signUpBaseSchema);

export const careerArchitectSignUpSchema = Yup.object({
  ...signUpBaseSchema,
  university: Yup.string().when('isPartnerStudent', {
    is: true,
    then: (schema) => schema.required('Please select your university'),
    otherwise: (schema) => schema.optional(),
  }),
  referralCode: Yup.string().optional(),
  accepted_agreement_ids: Yup.array().of(Yup.string().required()).default([]),
  sendUpdates: Yup.boolean(),
});

export const mentorSignUpSchema = Yup.object({
  ...signUpBaseSchema,
  professionalBio: Yup.string().max(500, 'Bio must be 500 characters or less'),
  accepted_agreement_ids: Yup.array().of(Yup.string().required()).default([]),
});

export const forgotPasswordSchema = Yup.object({
  email: emailRules,
});

export const resetPasswordSchema = Yup.object({
  password: passwordRules,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const otpVerificationSchema = Yup.object({
  code: Yup.string()
    .length(4, 'Enter the 4-digit code')
    .matches(/^[0-9]+$/, 'Code must contain only numbers')
    .required('Verification code is required'),
});


// Checkout Payment Validation Schema
export const checkoutSchema = Yup.object({
  cardHolder: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Cardholder name is required'),
  cardNumber: Yup.string()
    .required('Card number is required')
    .test('cardNumber', 'Enter a valid 16-digit card number', (val) =>
      !val ? false : val.replace(/\s/g, '').length === 16 && /^\d+$/.test(val.replace(/\s/g, ''))
    )
    .required('Card number is required'),
  expiryDate: Yup.string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format')
    .required('Expiry date is required'),
  cvv: Yup.string()
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits')
    .required('CVV is required'),
});

// Contact Form Validation Schema
export const contactFormSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: emailRules,
  subject: Yup.string()
    .min(5, 'Subject must be at least 5 characters')
    .required('Subject is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .required('Message is required'),
});

const openGraphFieldsSchema = {
  meta_title: Yup.string().trim(),
  meta_description: Yup.string().trim(),
  og_title: Yup.string().trim(),
  og_description: Yup.string().trim(),
  og_image: Yup.mixed()
    .nullable()
    .optional()
    .test('is-file-or-string-or-null', 'Please select a valid image file', (v) =>
      v == null || v instanceof File || typeof v === 'string'
    ),
  json_ld: Yup.string()
    .trim()
    .test('valid-json', 'Enter valid JSON-LD', (v) => {
      if (!v) return true;
      try {
        JSON.parse(v);
        return true;
      } catch {
        return false;
      }
    }),
};

// Add Book Modal Validation Schema (matches API: title, description, pricingModel, price, status, slug, cover_image, tags)
export const addBookSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Please enter a series title'),
  description: Yup.string()
    .trim()
    .required('Please enter a description'),
  cover_image: Yup.mixed<File>()
    .required('Please select a cover image')
    .test('is-file', 'Please select a cover image', (v) => v instanceof File),
  pricingModel: Yup.string().oneOf(['book', 'chapter']),
  status: Yup.string().oneOf(['Draft', 'Published']).required('Please select a status'),
  price: Yup.number()
    .transform((v) => (v === '' || v == null ? undefined : Number(v)))
    .when('pricingModel', {
      is: 'book',
      then: (schema) => schema.min(1, 'Price must be greater than 1').required('Price is required'),
      otherwise: (schema) => schema.optional(),
    }),
  ...openGraphFieldsSchema,
});
// Edit Book Modal Validation Schema — cover_image is optional (null = keep existing)
export const editBookSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Please enter a series title'),
  description: Yup.string()
    .trim()
    .required('Please enter a description'),
  cover_image: Yup.mixed<File>()
    .nullable()
    .optional()
    .test('is-file-or-null', 'Please select a valid image file', (v) => v == null || v instanceof File),
  pricingModel: Yup.string().oneOf(['book', 'chapter']),
  status: Yup.string().oneOf(['Draft', 'Published']).required('Please select a status'),
  price: Yup.number()
    .transform((v) => (v === '' || v == null ? undefined : Number(v)))
    .when('pricingModel', {
      is: 'book',
      then: (schema) => schema.min(1, 'Price must be greater than 1').required('Price is required'),
      otherwise: (schema) => schema.optional(),
    }),
  ...openGraphFieldsSchema,
});

// Add Chapter Modal Validation Schema (matches API form-data: book, number, title, description, content, isFree, price, cover_image, page)
export const addChapterSchema = Yup.object({
  bookId: Yup.string().required('Please select a series'),
  title: Yup.string()
    .trim()
    .required('Please enter a blueprint title'),
  description: Yup.string(),
  content: Yup.string(),
  isFree: Yup.boolean(),
  price: Yup.number()
    .when('isFree', {
      is: true,
      then: (schema) => schema.min(0).optional(),
      otherwise: (schema) =>
        schema
          .min(1, 'Price must be greater than 0 for paid blueprints')
          .required('Price is required when blueprint is not free'),
    }),
  status: Yup.string().oneOf([...BLUEPRINT_STATUSES], 'Select a valid status'),
  cover_image: Yup.mixed().required('Cover image is required'),
  accepted_agreement_ids: Yup.array().of(Yup.string().required()).default([]),
  ...openGraphFieldsSchema,
});

// Add / Edit Category Modal Validation Schema
export const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Please enter a category name'),
  subcategories: Yup.array().of(Yup.string().trim().required()),
});

// Add / Edit Address Modal Validation Schema (matches API: full_name, phone, address_line1, address_line2, landmark, city, state, country, postal_code, isDefault)
export const addressSchema = Yup.object({
  full_name: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Full name is required'),
  phone: Yup.string()
    .trim()
    .matches(/^\+?[0-9\s\-().]{7,15}$/, 'Enter a valid phone number')
    .required('Phone number is required'),
  address_line1: Yup.string().trim().required('Address line 1 is required'),
  address_line2: Yup.string().trim().optional(),
  landmark: Yup.string().trim().optional(),
  city: Yup.string().trim().optional(),
  state: Yup.string().trim().required('State is required'),
  country: Yup.string().trim().required('Country is required'),
  postal_code: Yup.string().trim().required('Postal / ZIP code is required'),
  isDefault: Yup.boolean(),
});

// Update Profile Validation Schema
export const updateProfileSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
});

// Mentor Profile Tab — Profile details (name, bio, social links) Validation Schema
export const mentorProfileDetailsSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must be at most 60 characters').required('Name is required'),
  phone: Yup.string()
    .trim()
    .test(
      'phone-or-empty',
      'Enter a valid phone number',
      (value) => !value || /^\+?[0-9\s\-().]{7,15}$/.test(value),
    ),
  professionalBio: Yup.string()
    .trim()
    .min(2, 'Bio must be at least 2 characters')
    .max(500, 'Bio must be at most 500 characters')
    .required('Professional bio is required'),
  facebook: Yup.string().trim().url('Enter a valid URL').optional(),
  linkedin: Yup.string().trim().url('Enter a valid URL').optional(),
  isEmailPrivate: Yup.boolean(),
  isNamePrivate: Yup.boolean(),
  isPhonePrivate: Yup.boolean(),
});

// Mentor Profile Tab — Payout details (bank / M-Pesa / tax) Validation Schema
export const mentorPayoutDetailsSchema = Yup.object({
  bank_name: Yup.string().trim().max(120, 'Too long').required('Bank name is required'),
  bank_number: Yup.string().trim().max(40, 'Too long').required('Account number is required'),
  bank_branch: Yup.string().trim().max(120, 'Too long').required('Bank branch is required'),
  mpesa_number: Yup.string().trim().max(20, 'Too long').required('M-Pesa number is required'),
  tax_id: Yup.string().trim().max(40, 'Too long').required('Tax ID is required'),
  preferred_payment_frequency: Yup.string().trim().required('Preferred payout frequency is required'),
  is_vat_registered: Yup.boolean().required(),
  vat_number: Yup.string().trim().max(40, 'Too long').when('is_vat_registered', {
    is: true,
    then: (schema) => schema.required('VAT number is required'),
    otherwise: (schema) => schema.optional(),
  }),
});

// Global Settings Validation Schema
const urlSchema = Yup.string().url('Must be a valid URL (https://...)');
export const globalSettingsSchema = Yup.object({
  // Platform
  platformName: Yup.string().trim().required('Platform name is required'),
  marketplace_name: Yup.string().trim().required('Marketplace name is required'),
  platformDescription: Yup.string().trim(),
  supportEmail: emailRules.label('Support email'),
  email: Yup.string().test('strict-email', 'Enter a valid contact email', (v) => !v || validateEmail(v)),
  phone: Yup.string().matches(/^\+?[0-9\s\-().]{7,15}$/, 'Enter a valid phone number'),
  alt_phone: Yup.string().matches(/^\+?[0-9\s\-().]{7,15}$/, 'Enter a valid alternate phone number'),
  address: Yup.string().trim(),
  copy_right_text: Yup.string().trim(),
  default_tax_rate: Yup.number()
    .typeError('Default tax rate must be a number')
    .min(0, 'Default tax rate cannot be negative')
    .max(100, 'Default tax rate cannot exceed 100'),
  // Header
  header_text: Yup.string().trim(),
  header_text_status: Yup.boolean(),
  visible: Yup.string().oneOf(['chapter', 'book'], 'Select a valid option'),
  checkout_status: Yup.boolean(),
  // App URLs
  android_app_url: urlSchema,
  iphone_app_url: urlSchema,
  ...openGraphFieldsSchema,
  // Analytics
  google_analytics_id: Yup.string().trim(),
  google_tag_manager: Yup.string().trim(),
  facebook_pixel: Yup.string().trim(),
  microsoft_clarity: Yup.string().trim(),
  bing_tracking_code: Yup.string().trim(),
  // Social Links
  instagram_link: urlSchema,
  facebook_link: urlSchema,
  x_link: urlSchema,
  youtube_link: urlSchema,
  linkdin_link: urlSchema,
  pinterest_link: urlSchema,
  whatsapp_link: urlSchema,
  tiktok_link: urlSchema,
  // Notifications
  emailNotificationsNewUsers: Yup.boolean(),
  emailNotificationsPurchases: Yup.boolean(),
  dailySummaryReports: Yup.boolean(),
  alertFlaggedContent: Yup.boolean(),
});

// Testimonial Form Validation Schema
export const testimonialSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  title: Yup.string().trim().required('Title / role is required'),
  message: Yup.string().trim().required('Message is required'),
  rating: Yup.number()
    .typeError('Rating must be a number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5')
    .required('Rating is required'),
  status: Yup.string()
    .oneOf(['Active', 'Inactive'], 'Select a valid status')
    .required('Status is required'),
  photo: Yup.mixed().nullable().optional(),
});

export const inviteMentorSchema = Yup.object({
  fullName: Yup.string().trim(),
  email: emailRules,
});

// Add / Edit Author (Thought Leader) Modal Validation Schema
export const authorSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required('Please enter full name'),
  email: emailRules,
  professionalBio: Yup.string().trim(),
  status: Yup.string()
    .oneOf(['Active', 'Inactive'], 'Status must be Active or Inactive')
    .required('Please select status'),
  avatar: Yup.mixed()
    .optional()
    .nullable()
    .test('avatar', 'Avatar must be an image file or valid URL', (v) =>
      !v || v instanceof File || (typeof v === 'string' && /^https?:\/\//.test(v))
    ),
});

const optionalUrl = Yup.string()
  .trim()
  .transform((v) => (v === '' ? undefined : v))
  .url('Enter a valid URL')
  .optional();

// Career Architect → Mentor conversion application
export const mentorConversionApplicationSchema = Yup.object({
  linkedinUrl: optionalUrl,
  facebookUrl: optionalUrl,
  careerSummary: Yup.string()
    .trim()
    .required('Career summary is required')
    .test('min-words', 'Minimum 10 words required', (value) => {
      if (!value) return true;
      return value.split(/\s+/).filter(Boolean).length >= 10;
    })
    .test('max-words', 'Maximum 300 words', (value) => {
      if (!value) return true;
      return value.split(/\s+/).filter(Boolean).length <= 300;
    }),
  paymentFrequency: Yup.string()
    .oneOf(['monthly', 'quarterly', 'annually'], 'Select payment frequency')
    .required('Select payment frequency'),
  bankName: Yup.string().trim().required('Bank name is required'),
  accountNumber: Yup.string().trim().required('Account number is required'),
  mpesaNumber: Yup.string()
    .trim()
    .required('M-Pesa number is required')
    .matches(/^\+?[0-9]{9,15}$/, 'Enter a valid phone number'),
  accepted_agreement_ids: Yup.array().of(Yup.string().required()).default([]),
});

// Verified Mentor application (existing Mentor applying for verified status)
export const verifiedMentorApplicationSchema = Yup.object({
  applicationStatement: Yup.string()
    .trim()
    .required('Application statement is required')
    .test('min-words', 'Minimum 10 words required', (value) => {
      if (!value) return true;
      return value.split(/\s+/).filter(Boolean).length >= 10;
    })
    .test('max-words', 'Maximum 300 words', (value) => {
      if (!value) return true;
      return value.split(/\s+/).filter(Boolean).length <= 300;
    }),
  portfolioUrl: optionalUrl,
  accepted_agreement_ids: Yup.array().of(Yup.string().required()).default([]),
});

// Add / Edit Institution Modal Validation Schema
export const institutionSchema = Yup.object({
  name: Yup.string().trim().required('Institution name is required'),
  contact_email: emailRules.label('Contact email'),
  domains: Yup.string().trim().required('At least one email domain is required'),
  promo_start: Yup.string().required('Start date is required'),
  promo_end: Yup.string()
    .required('End date is required')
    .test('after-start', 'End date must be on or after start date', function (value) {
      const start = this.parent.promo_start;
      if (!value || !start) return true;
      return value >= start;
    }),
  status: Yup.string().oneOf(['Active', 'Inactive']),
  books_pricing_type: Yup.string().oneOf(['Market Price', 'Discounted Price']),
  discount_percentage: Yup.number().when('books_pricing_type', {
    is: 'Discounted Price',
    then: (schema) => schema.min(1, 'Min 1%').max(100, 'Max 100%').required('Discount is required'),
    otherwise: (schema) => schema.optional(),
  }),
  // accepted_agreement_ids: Yup.array().of(Yup.string().required()).default([]),
});

// Extend Promotional Period Modal — pass context: { currentEnd } from Formik
export const extendPromotionSchema = Yup.object({
  new_end_date: Yup.string()
    .required('New end date is required')
    .test('after-current', 'New date must be after current end date', function (value) {
      const currentEnd = this.options.context?.currentEnd as string | undefined;
      if (!value || !currentEnd) return true;
      return value > currentEnd;
    }),
});

// Registration Prompt Tab Validation Schema
export const registrationPromptSchema = Yup.object({
  is_enabled: Yup.boolean(),
  heading: Yup.string().trim().required('Heading is required'),
  message: Yup.string().trim().required('Message body is required'),
  contact_email: emailRules.label('Contact email'),
});

// Add / Edit Role Modal Validation Schema
export const roleSchema = Yup.object({
  name: Yup.string().trim().required('Role name is required'),
  description: Yup.string().trim(),
  number_of_users: Yup.number()
    .transform((v) => (v === '' || v == null ? 0 : Number(v)))
    .integer('Must be a whole number')
    .min(0, 'Number of users cannot be negative'),
});

export const staffStatusSchema = Yup.object({
  status_reason: Yup.string().trim().required('Reason is required'),
});

// Edit platform user (admin users module) — PUT /admin/update-users/:id (form-data)
export const editUserSchema = Yup.object({
  name: Yup.string().trim().required('Full name is required'),
  email: emailRules.label('Email'),
  phone: Yup.string()
    .trim()
    .test(
      'phone-or-empty',
      'Enter a valid phone number',
      (value) => !value || /^\+?[0-9\s\-().]{7,15}$/.test(value),
    ),
  facebook: Yup.string()
    .trim()
    .test('url-or-empty', 'Enter a valid Facebook URL', (value) => !value || /^https?:\/\/.+/i.test(value)),
  linkedin: Yup.string()
    .trim()
    .test('url-or-empty', 'Enter a valid LinkedIn URL', (value) => !value || /^https?:\/\/.+/i.test(value)),
  professionalBio: Yup.string().trim(),
  profile_pic: Yup.mixed().nullable(),
});

// Add / Edit staff — Edit User fields + role assignment
export const staffSchema = editUserSchema.shape({
  role_id: Yup.string().required('Role is required'),
});

export const editStaffSchema = staffSchema;

// Add / Edit Agreement Type Modal Validation Schema
export const agreementTypeSchema = Yup.object({
  name: Yup.string().trim().min(2, 'Name is required').required('Name is required'),
  description: Yup.string().trim().min(2, 'Description is required').required('Description is required'),
  status: Yup.string().oneOf(['active', 'inactive'], 'Status must be Active or Inactive').required('Status is required'),
});

// Add / Edit Tax Modal Validation Schema
export const taxSchema = Yup.object({
  country: Yup.string().trim().min(2, 'Country is required').required('Country is required'),
  country_code: Yup.string()
    .trim()
    .uppercase()
    .matches(/^[A-Z]{2}$/, 'Country code must be a 2-letter ISO code')
    .required('Country code is required'),
  tax_name: Yup.string().trim().min(2, 'Tax name is required').required('Tax name is required'),
  tax_percent: Yup.number()
    .typeError('Tax percent must be a number')
    .min(0, 'Tax percent must be 0 or more')
    .max(100, 'Tax percent cannot exceed 100')
    .required('Tax percent is required'),
  status: Yup.string().oneOf(['Active', 'Inactive'], 'Status must be Active or Inactive').required('Status is required'),
});

// Add / Edit Mentor Tier Modal Validation Schema
const optionalNonNegativeNumber = Yup.number()
  .transform((v) => (v === '' || v == null ? undefined : Number(v)))
  .min(0, 'Must be 0 or more')
  .optional();

export const mentorTierSchema = Yup.object({
  code: Yup.string().trim().min(2, 'Tier code is required').required('Tier code is required'),
  mentor_share_percent: Yup.number().min(0).max(100).required('Required'),
  platform_share_percent: Yup.number().min(0).max(100).required('Required'),
  rank: Yup.number().min(1, 'Rank must be at least 1').required('Rank is required'),
  status: Yup.string().oneOf(['active', 'inactive'], 'Status must be Active or Inactive').required('Status is required'),
  max_mentors: optionalNonNegativeNumber,
  min_confirmed_sales: optionalNonNegativeNumber,
  min_days_since_published: optionalNonNegativeNumber,
  min_words_per_blueprint: optionalNonNegativeNumber,
  badge: Yup.mixed()
    .nullable()
    .optional()
    .test('badge', 'Badge must be an image file', (v) => !v || v instanceof File || typeof v === 'string'),
});

// Add / Edit Coupon Modal Validation Schema (matches API: coupon_code, coupon_type, coupon_for, institutions, books, chapters, value, expiry_date, minimum_cart_value, usage_limit, status)
export const couponSchema = Yup.object({
  coupon_code: Yup.string()
    .trim()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(30, 'Coupon code must be at most 30 characters')
    .matches(/^[A-Za-z0-9_-]+$/, 'Only letters, numbers, hyphens and underscores are allowed')
    .required('Coupon code is required'),
  coupon_type: Yup.string().oneOf(COUPON_TYPES, 'Select a valid coupon type').required('Coupon type is required'),
  coupon_for: Yup.string().oneOf(COUPON_SCOPES, 'Select a valid scope').required('Coupon scope is required'),
  institutions: Yup.array().of(Yup.string().required()).default([]),
  books: Yup.array().of(Yup.string().required()).default([]),
  chapters: Yup.array().of(Yup.string().required()).default([]),
  value: Yup.number()
    .transform((v) => (v === '' || v == null ? undefined : Number(v)))
    .when('coupon_type', {
      is: 'Free',
      then: (schema) => schema.min(0).optional(),
      otherwise: (schema) =>
        schema
          .min(1, 'Value must be greater than 0')
          .required('Value is required')
          .when('coupon_type', {
            is: 'Percentage',
            then: (percentSchema) => percentSchema.max(100, 'Percentage cannot exceed 100'),
          }),
    }),
  expiry_date: Yup.string().required('Expiry date is required'),
  minimum_cart_value: Yup.number()
    .transform((v) => (v === '' || v == null ? 0 : Number(v)))
    .min(0, 'Minimum cart value cannot be negative'),
  usage_limit: Yup.number()
    .transform((v) => (v === '' || v == null ? 0 : Number(v)))
    .min(0, 'Usage limit cannot be negative')
    .integer('Must be a whole number'),
  status: Yup.string().oneOf(['active', 'inactive'], 'Status must be Active or Inactive').required('Status is required'),
});

// Add / Edit Agreement Modal Validation Schema
export const agreementSchema = Yup.object({
  title: Yup.string().trim().min(2, 'Title is required').required('Title is required'),
  slug: Yup.string().trim().required('Slug is required'),
  text: Yup.string().trim().required('Text is required'),
  content: Yup.string().trim().required('Agreement content is required'),
  agreementType: Yup.string().required('Please select an agreement type'),
  status: Yup.string().oneOf(['active', 'inactive'], 'Status must be Active or Inactive').required('Status is required'),
  visible_to: Yup.array().of(Yup.string().required()).min(1, 'Select at least one user type').required(),
  touchpoints: Yup.array().of(Yup.string().required()).min(1, 'Select at least one touchpoint').required(),
  is_required: Yup.boolean(),
  can_block: Yup.boolean(),
});