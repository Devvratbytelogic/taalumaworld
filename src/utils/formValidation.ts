import * as Yup from 'yup';


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

export const signUpSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: emailRules,
  password: passwordRules,
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
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

// Add Book Modal Validation Schema (matches API: title, thoughtLeader, category, subcategory, description, pricingModel, price, cover_image, tags)
export const addBookSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Please enter a book title'),
  description: Yup.string()
    .trim()
    .required('Please enter a description'),
  thoughtLeader: Yup.string().required('Please select a thought leader'),
  category: Yup.string().required('Please select a category'),
  cover_image: Yup.mixed<File>()
    .required('Please select a cover image')
    .test('is-file', 'Please select a cover image', (v) => v instanceof File),
  price: Yup.number()
    .transform((v) => (v === '' || v == null ? undefined : Number(v)))
    .min(1, 'Price must be greater than 1')
    .required('Price is required'),
});
// Edit Book Modal Validation Schema — cover_image is optional (null = keep existing)
export const editBookSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Please enter a book title'),
  description: Yup.string()
    .trim()
    .required('Please enter a description'),
  thoughtLeader: Yup.string().required('Please select a thought leader'),
  category: Yup.string().required('Please select a category'),
  cover_image: Yup.mixed<File>()
    .nullable()
    .optional()
    .test('is-file-or-null', 'Please select a valid image file', (v) => v == null || v instanceof File),
  price: Yup.number()
    .transform((v) => (v === '' || v == null ? undefined : Number(v)))
    .min(1, 'Price must be greater than 1')
    .required('Price is required'),
});

// Add Chapter Modal Validation Schema (matches API form-data: book, number, title, description, content, isFree, price, status, cover_image, page)
export const addChapterSchema = Yup.object({
  bookId: Yup.string().required('Please select a book'),
  title: Yup.string()
    .trim()
    .required('Please enter a chapter title'),
  description: Yup.string(),
  content: Yup.string(),
  sequence: Yup.number()
    .integer('Must be a whole number')
    .min(1, 'Sequence must be at least 1')
    .required('Sequence is required'),
  // page: Yup.number()
  //   .integer('Must be a whole number')
  //   .min(0, 'Page cannot be negative')
  //   .required('Page is required'),
  isFree: Yup.boolean(),
  price: Yup.number()
    .when('isFree', {
      is: true,
      then: (schema) => schema.min(0).optional(),
      otherwise: (schema) =>
        schema
          .min(1, 'Price must be greater than 0 for paid chapters')
          .required('Price is required when chapter is not free'),
    }),
  status: Yup.string().required('Status is required'),
  cover_image: Yup.mixed().required('Cover image is required'),
});

// Add / Edit Category Modal Validation Schema
export const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Please enter a category name'),
  subcategories: Yup.array().of(Yup.string().trim().required()),
});

// Update Profile Validation Schema
export const updateProfileSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
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
  // Header
  header_text: Yup.string().trim(),
  header_text_status: Yup.boolean(),
  visible: Yup.string().oneOf(['chapter', 'book'], 'Select a valid option'),
  checkout_status: Yup.boolean(),
  // App URLs
  android_app_url: urlSchema,
  iphone_app_url: urlSchema,
  // SEO
  meta_title: Yup.string().trim(),
  meta_description: Yup.string().trim(),
  meta_keywords: Yup.string().trim(),
  og_tag: Yup.string().trim(),
  search_console: Yup.string().trim(),
  schema_markup: Yup.string().trim(),
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
  // Notifications
  emailNotificationsNewUsers: Yup.boolean(),
  emailNotificationsPurchases: Yup.boolean(),
  dailySummaryReports: Yup.boolean(),
  alertFlaggedContent: Yup.boolean(),
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