'use client';

import {ArrowUpRight} from 'lucide-react';
import {useRef, useState, type FormEvent, type ReactNode} from 'react';
import {Button} from '@/src/shared/ui/button';
import {contactCopy} from '../config/content';
import {
  buildInquiryMailto,
  firstInvalidField,
  validateInquiry,
  type InquiryErrors,
  type InquiryFields,
  type RequiredInquiryField,
} from '../model/inquiry';

type ContactFormProps = {
  email: string;
};

const emptyFields: InquiryFields = {name: '', email: '', phone: '', message: ''};

export function ContactForm({email}: ContactFormProps) {
  const [fields, setFields] = useState<InquiryFields>(emptyFields);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [notice, setNotice] = useState<'prepared' | 'too-long' | null>(null);
  const [copyNotice, setCopyNotice] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  function update(field: keyof InquiryFields, value: string) {
    const next = {...fields, [field]: value};
    setFields(next);
    if (attempted) setErrors(validateInquiry(next));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateInquiry(fields);
    setAttempted(true);
    setErrors(nextErrors);
    const invalid = firstInvalidField(nextErrors);
    if (invalid) {
      setNotice(null);
      focusField(invalid);
      return;
    }

    const draft = buildInquiryMailto(email, fields);
    if (draft.tooLong) {
      setNotice('too-long');
      return;
    }

    setNotice('prepared');
    window.location.href = draft.href;
  }

  function focusField(field: RequiredInquiryField) {
    const target = field === 'name' ? nameRef : field === 'email' ? emailRef : messageRef;
    target.current?.focus();
  }

  async function copyText(value: string, success: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setCopyNotice(success);
    } catch {
      setCopyNotice(contactCopy.copyFailed);
    }
  }

  return (
    <form className="contact-form" noValidate onSubmit={onSubmit}>
      <div className="contact-form-body">
      <p className="contact-eyebrow contact-eyebrow-dark">{contactCopy.formEyebrow}</p>
      <h2 id="contact-form-title" className="contact-form-heading">
        {contactCopy.formHeading}<span className="contact-dot">.</span>
      </h2>
      <p className="contact-lede">{contactCopy.formDescription}</p>
      <p className="contact-required-note" id="contact-required-note">
        {contactCopy.requiredNote}
      </p>

      <div className="contact-fields">
        <div className="contact-name-row">
          <Field id="contact-name" label={contactCopy.fields.name.label} required error={errors.name}>
            <input
              ref={nameRef}
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder={contactCopy.fields.name.placeholder}
              value={fields.name}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={errors.name ? 'contact-name-error contact-required-note' : 'contact-required-note'}
              aria-required="true"
              onChange={(event) => update('name', event.target.value)}
            />
          </Field>
          <Field id="contact-email" label={contactCopy.fields.email.label} required error={errors.email}>
            <input
              ref={emailRef}
              id="contact-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              placeholder={contactCopy.fields.email.placeholder}
              value={fields.email}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'contact-email-error' : undefined}
              aria-required="true"
              onChange={(event) => update('email', event.target.value)}
            />
          </Field>
        </div>

        <Field id="contact-phone" label={contactCopy.fields.phone.label} optional>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            autoCorrect="off"
            placeholder={contactCopy.fields.phone.placeholder}
            value={fields.phone}
            onChange={(event) => update('phone', event.target.value)}
          />
        </Field>

        <Field id="contact-message" label={contactCopy.fields.message.label} required error={errors.message}>
          <textarea
            ref={messageRef}
            id="contact-message"
            name="message"
            rows={5}
            placeholder={contactCopy.fields.message.placeholder}
            value={fields.message}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={errors.message ? 'contact-message-error' : undefined}
            aria-required="true"
            onChange={(event) => update('message', event.target.value)}
          />
        </Field>
      </div>
      </div>

      <div className="contact-actions">
        <Button type="submit" variant="accent" className="contact-submit">
          {contactCopy.button}
          <ArrowUpRight aria-hidden className="size-[16px]" />
        </Button>
        {notice === 'too-long' ? (
          <button
            type="button"
            className="contact-copy"
            onClick={() => copyText(buildInquiryMailto(email, fields).text, contactCopy.copiedMessage)}
          >
            {contactCopy.copyMessage}
          </button>
        ) : null}
        <div className="contact-live" aria-live="polite">
          {notice === 'prepared' ? <p className="contact-status">{contactCopy.preparedNotice}</p> : null}
          {notice === 'too-long' ? <p className="contact-status">{contactCopy.tooLongNotice}</p> : null}
          {copyNotice ? <p className="contact-status">{copyNotice}</p> : null}
        </div>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required = false,
  optional = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="contact-field">
      <label htmlFor={id}>
        {label}
        {required ? (
          <>
            <span className="contact-required-mark" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> required</span>
          </>
        ) : null}
        {optional ? <span className="sr-only"> optional</span> : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="contact-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
