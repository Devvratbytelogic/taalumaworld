import * as Yup from 'yup';


// Sign In Validation Schema
export const signInSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const signUpSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export const otpVerificationSchema = Yup.object({
  code: Yup.string()
    .length(6, 'Enter the 6-digit code')
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
    email: Yup.string()
      .email('Please enter a valid email address')
      .required('Email is required'),
    subject: Yup.string()
      .min(5, 'Subject must be at least 5 characters')
      .required('Subject is required'),
    message: Yup.string()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters')
      .required('Message is required'),
  });

// Add Book Modal Validation Schema
export const addBookSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Please enter a book title'),
  description: Yup.string(),
  authorId: Yup.string().required('Please select an author'),
  categoryIds: Yup.array()
    .of(Yup.string().required())
    .min(1, 'Select at least one category'),
  tags: Yup.array().of(Yup.string().required()),
  tagsInput: Yup.string(),
  chapters: Yup.array(),
});

// Add Chapter Modal Validation Schema
export const addChapterSchema = Yup.object({
  bookId: Yup.string().required('Please select a book'),
  title: Yup.string()
    .trim()
    .required('Please enter a chapter title'),
  description: Yup.string(),
  sequence: Yup.number()
    .integer('Must be a whole number')
    .min(1, 'Sequence must be at least 1')
    .required('Sequence is required'),
  isFree: Yup.boolean(),
  price: Yup.number()
    .min(0, 'Price cannot be negative')
    .when('isFree', {
      is: true,
      then: (schema) => schema.optional(),
      otherwise: (schema) => schema.required('Price is required when chapter is not free'),
    }),
});

// Add / Edit Category Modal Validation Schema
export const categorySchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Please enter a category name'),
  subcategories: Yup.array().of(Yup.string().trim().required()),
});