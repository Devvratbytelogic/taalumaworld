import * as Yup from 'yup';


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