export const INQUIRY_SUBJECT = 'Website inquiry';

/** Mail clients often drop mailto links beyond roughly this length. */
export const MAILTO_HREF_LIMIT = 1800;

export type InquiryFields = {
  name: string;
  email: string;
  phone: string;
  message: string;
};

export type InquiryFieldName = keyof InquiryFields;
export type RequiredInquiryField = 'name' | 'email' | 'message';
export type InquiryErrors = Partial<Record<RequiredInquiryField, string>>;

const requiredOrder: RequiredInquiryField[] = ['name', 'email', 'message'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function normalizeInquiry(fields: InquiryFields): InquiryFields {
  return {
    name: fields.name.trim(),
    email: fields.email.trim(),
    phone: fields.phone.trim(),
    message: fields.message.trim(),
  };
}

export function validateInquiry(fields: InquiryFields): InquiryErrors {
  const value = normalizeInquiry(fields);
  const errors: InquiryErrors = {};

  if (!value.name) errors.name = 'Enter your name.';
  if (!value.email) errors.email = 'Enter your email.';
  else if (!emailPattern.test(value.email)) errors.email = 'Enter a valid email address.';
  if (!value.message) errors.message = 'Enter a message.';

  return errors;
}

export function firstInvalidField(errors: InquiryErrors): RequiredInquiryField | null {
  return requiredOrder.find((field) => errors[field]) ?? null;
}

export function inquiryBody(fields: InquiryFields): string {
  const value = normalizeInquiry(fields);
  return `Name: ${value.name}\nEmail: ${value.email}\nPhone: ${value.phone}\n\n${value.message}`;
}

export function inquiryDraftText(recipient: string, fields: InquiryFields, subject = INQUIRY_SUBJECT): string {
  return `To: ${recipient}\nSubject: ${subject}\n\n${inquiryBody(fields)}`;
}

export type InquiryDraft = {
  href: string;
  body: string;
  subject: string;
  text: string;
  tooLong: boolean;
};

export function buildInquiryMailto(recipient: string, fields: InquiryFields, subject = INQUIRY_SUBJECT): InquiryDraft {
  const body = inquiryBody(fields);
  const href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return {
    href,
    body,
    subject,
    text: inquiryDraftText(recipient, fields, subject),
    tooLong: href.length > MAILTO_HREF_LIMIT,
  };
}
