import nodemailer from 'nodemailer';

/**
 * Create email transporter
 * @returns {Object} Nodemailer transporter
 */
const createTransporter = () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return null; // Email not configured
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Email text content
 * @param {string} options.html - Email HTML content
 * @returns {Promise<Object>} Email send result
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('Email not configured. Skipping email send.');
    return { success: false, message: 'Email not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"OZME Support" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send contact form notification email
 * @param {Object} contactData - Contact form data
 * @returns {Promise<Object>} Email send result
 */
export const sendContactEmail = async (contactData) => {
  const { name, email, phone, category, message } = contactData;

  const subject = `New Contact Form Submission - ${category}`;
  const text = `
    New contact form submission from OZME website:
    
    Name: ${name}
    Email: ${email}
    Phone: ${phone || 'Not provided'}
    Category: ${category}
    
    Message:
    ${message}
  `;

  const html = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
    <p><strong>Category:</strong> ${category}</p>
    <h3>Message:</h3>
    <p>${message.replace(/\n/g, '<br>')}</p>
  `;

  return await sendEmail({
    to: process.env.EMAIL_FROM || 'support@ozme.in',
    subject,
    text,
    html,
  });
};

