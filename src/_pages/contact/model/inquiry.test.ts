import assert from 'node:assert/strict';
import test from 'node:test';
import {contact} from '../../../widgets/site-chrome/config/content.ts';
import {
  buildInquiryMailto,
  firstInvalidField,
  MAILTO_HREF_LIMIT,
  validateInquiry,
  type InquiryFields,
} from './inquiry.ts';

const sample: InquiryFields = {
  name: 'Алексей & Co',
  email: 'user+tag@example.com',
  phone: '+44 20 7946 0958',
  message: 'Wheels? 20% & #finish\nLine two',
};

test('mailto encodes subject and body without letting the visitor set recipients', () => {
  const draft = buildInquiryMailto('sales@example.com', {
    ...sample,
    message: `${sample.message}\nBcc: bad@evil.test`,
  });
  const url = new URL(draft.href);

  assert.equal(url.protocol, 'mailto:');
  assert.equal(url.pathname, 'sales@example.com');
  assert.deepEqual([...url.searchParams.keys()], ['subject', 'body']);
  assert.equal(url.searchParams.get('subject'), 'Website inquiry');
  assert.equal(url.searchParams.get('cc'), null);
  assert.equal(url.searchParams.get('bcc'), null);
  assert.equal(
    url.searchParams.get('body'),
    'Name: Алексей & Co\nEmail: user+tag@example.com\nPhone: +44 20 7946 0958\n\nWheels? 20% & #finish\nLine two\nBcc: bad@evil.test',
  );
  assert.equal(draft.href.includes('#'), false);
  assert.equal(draft.href.includes('user+tag@'), false);
  assert.match(draft.href, /user%2Btag%40example\.com/);
  assert.equal(draft.tooLong, false);
});

test('long messages stay intact and are flagged instead of being cut', () => {
  const message = `Wheel finish ${'& #?'.repeat(300)}`;
  const draft = buildInquiryMailto('sales@example.com', {
    name: 'Ada',
    email: 'ada@example.com',
    phone: '',
    message,
  });

  assert.equal(draft.tooLong, true);
  assert.ok(draft.href.length > MAILTO_HREF_LIMIT);
  assert.equal(draft.body.endsWith(message), true);
  assert.match(draft.href, new RegExp(encodeURIComponent(message.slice(-16))));
});

test('phone stays optional, including international numbers, and required fields stay name, email, and message', () => {
  assert.deepEqual(validateInquiry({name: 'Ada', email: 'ada@example.com', phone: '', message: 'Hello'}), {});
  assert.deepEqual(
    validateInquiry({name: 'Ada', email: 'ada@example.com', phone: '+1 (281) 893-1134', message: 'Hello'}),
    {},
  );
  assert.deepEqual(validateInquiry({name: 'Ada', email: 'user+tag@example.com', phone: '++', message: 'Hello'}), {});

  const errors = validateInquiry({name: '   ', email: 'not-an-email', phone: 'abc', message: '\n'});
  assert.equal(errors.name, 'Enter your name.');
  assert.equal(errors.email, 'Enter a valid email address.');
  assert.equal(errors.message, 'Enter a message.');
  assert.equal('phone' in errors, false);
  assert.equal(firstInvalidField(errors), 'name');
  assert.equal(firstInvalidField({message: 'Enter a message.'}), 'message');
  assert.equal(firstInvalidField({}), null);
});

test('directions search the configured showroom address', () => {
  const url = new URL(contact.mapsSearchHref);
  assert.equal(url.origin, 'https://www.google.com');
  assert.equal(url.pathname, '/maps/search/');
  assert.equal(url.searchParams.get('query'), contact.addressLines.join(', '));
  assert.equal(url.searchParams.get('query'), '14037 Stuebner Airline Rd, Houston, TX 77069');
  assert.equal(contact.emailHref, `mailto:${contact.email}`);
  assert.equal(contact.phoneHref, `tel:${contact.phoneDisplay}`);
});
