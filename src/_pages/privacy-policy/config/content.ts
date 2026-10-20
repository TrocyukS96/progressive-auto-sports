export type PolicySection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export type PolicyHighlight = {
  title: string;
  text: string;
};

export const privacyIntro = {
  eyebrow: 'Your information',
  title: 'Privacy Policy',
  lede: 'What happens when you browse this site or write to the Houston showroom.',
  updatedLabel: 'Updated',
  updated: 'October 20, 2026',
};

export const privacyHighlights: PolicyHighlight[] = [
  {
    title: 'No sale of your details',
    text: 'We do not sell the name, phone number, or email you send the showroom.',
  },
  {
    title: 'You send the email',
    text: 'The contact form opens a draft in your own email app. This site does not keep a copy.',
  },
  {
    title: 'No account required',
    text: 'You can browse vehicles, wheels, and the gallery without signing in.',
  },
];

export const privacySections: PolicySection[] = [
  {
    id: 'who-we-are',
    title: 'Who we are',
    paragraphs: [
      'Progressive Autosports is a Houston showroom for vehicles, custom wheels, and related work. This policy describes progressiveautosports.com only.',
      'A contract you sign at the showroom, with a lender, or with a wheel brand is separate from this page.',
    ],
  },
  {
    id: 'what-you-send',
    title: 'Information you choose to send',
    paragraphs: [
      'You can look through the site without giving us your name. If you use the contact form, it does not save your message here. It prepares an email in your own mail app, addressed to the showroom, with the name, email address, phone number, and message you entered. Nothing is sent until you send that email yourself.',
      'You can also call or email the showroom directly. We use those messages to answer questions about vehicles, wheels, appointments, and visits.',
    ],
  },
  {
    id: 'what-we-skip',
    title: 'What this site does not collect',
    paragraphs: [
      'There is no account, shopping cart, or payment page on this website. We do not ask for a driver’s license, payment card, Social Security number, or similar records here.',
      'The site does not run its own analytics or advertising tags, and it does not build a profile of your visit.',
    ],
  },
  {
    id: 'how-we-use-it',
    title: 'How we use a message',
    paragraphs: [
      'We read a message so we can reply, arrange a visit, or follow up on the car or wheels you asked about. We do not sell your name, phone number, or email. Asking a question does not place you on a mailing list.',
    ],
  },
  {
    id: 'other-sites',
    title: 'Sites and services outside this page',
    paragraphs: [
      'Some wheel brands, Facebook, and Instagram open on another site. Those sites have their own privacy practices. Your email app is also outside this website. After you send a message, it is handled by that mail service and by the showroom inbox.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies',
    paragraphs: [
      'This website does not set analytics or advertising cookies. Your browser still requests each page in the ordinary way. That request can include technical details such as the page address and the time of the visit. We do not use those details to recognize you on a later visit.',
    ],
  },
  {
    id: 'your-choices',
    title: 'Asking about your information',
    paragraphs: [
      'An email you send stays in the showroom mailbox while we need it for your request and for ordinary business records. You can ask us to correct a message or to delete one we no longer need.',
      'Call or email the showroom. We may ask a simple question so we know the request is yours. We will not ask you to email copies of identity documents when a phone call is enough.',
    ],
  },
  {
    id: 'children',
    title: 'Children',
    paragraphs: [
      'The site is meant for adults choosing a vehicle or a set of wheels. We do not knowingly collect information from children.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to this page',
    paragraphs: [
      'If the way the site handles information changes, this page will change with it. The date above is the date of the current text.',
    ],
  },
];

export const privacyContact = {
  title: 'Talk to the showroom',
  text: 'Questions about this policy, or a request to correct or delete a message, go to the same showroom that answers the site.',
};
