import type { PhotoKey } from '@/lib/images'

export type Feature = {
  slug: string
  title: string
  short: string
  description: string
  benefits: string[]
  image: PhotoKey
  icon: 'calendar' | 'wallet' | 'handshake' | 'messages' | 'vault' | 'journal'
}

export const features: Feature[] = [
  {
    slug: 'shared-calendar',
    title: 'Shared Calendar',
    short: 'One calendar both parents can see, update and trust.',
    description:
      'School pick-ups, clinic visits, holidays and weekend plans live in one shared month view. Each event shows which parent is responsible, so nobody has to guess who is collecting Amani on Thursday.',
    benefits: [
      'Month view with colour coded responsibility',
      'Add school, medical, holiday and activity events',
      'Notes that travel with the event, not through WhatsApp',
      'Mobile view scrolls sideways instead of squeezing the grid',
    ],
    image: 'parentLaptop',
    icon: 'calendar',
  },
  {
    slug: 'expense-tracker',
    title: 'Expense Tracker',
    short: 'Child expenses, split clearly, with nothing hidden.',
    description:
      'School fees, medical bills, uniforms and activities recorded in Kenya shillings, with the split agreed up front. The balance indicator shows who has paid what, so money conversations start from facts instead of suspicion.',
    benefits: [
      'Categories for school fees, medical, clothing and activities',
      'Split percentage on every record',
      'Receipt uploads kept with the expense',
      'Running total per parent and a live balance indicator',
    ],
    image: 'planningTable',
    icon: 'wallet',
  },
  {
    slug: 'handover-logs',
    title: 'Handover Logs',
    short: 'A calm, dated record of every handover.',
    description:
      'Note the time, place and condition of your child at each handover, with an optional photo. Over months this becomes a quiet, factual record that protects everybody, including you.',
    benefits: [
      'Date, time, location and receiving parent',
      'Condition notes and optional photo',
      'Chronological history you can scroll back through',
      'Wording that stays neutral and child focused',
    ],
    image: 'handoverHug',
    icon: 'handshake',
  },
  {
    slug: 'secure-messaging',
    title: 'Secure Messaging',
    short: 'A two-party thread that stays about the child.',
    description:
      'One private thread between the two parents, away from the group chats and the rest of your life. Messages are stored securely and read in context, next to the schedule and the expense record they refer to.',
    benefits: [
      'Only the two parents in the thread',
      'Ordered history with clear timestamps',
      'No read receipts pressure, no public group',
      'Works alongside the calendar instead of replacing it',
    ],
    image: 'motherBaby',
    icon: 'messages',
  },
  {
    slug: 'document-vault',
    title: 'Document Vault',
    short: 'The paperwork that matters, in one place.',
    description:
      'Custody agreements, school reports, medical records and birth certificates stored once and available to both parents. No more searching old emails the night before a school meeting.',
    benefits: [
      'Uploaded to private Vercel Blob storage',
      'Grouped by custody, school, medical and identity',
      'Download links for both parents',
      'Clear record of who uploaded what and when',
    ],
    image: 'deskWork',
    icon: 'vault',
  },
  {
    slug: 'progress-journal',
    title: 'Progress Journal',
    short: 'Private milestones, kept just for you.',
    description:
      'First words, first steps, school achievements and health notes, written down while they are fresh. Each parent has their own private journal, because not every memory needs to be shared to be held.',
    benefits: [
      'Private to each parent, never visible to the other',
      'Rich text entries with a date and category',
      'Categories for milestones, school and health',
      'A gentle record of the childhood you are both raising',
    ],
    image: 'familyHome',
    icon: 'journal',
  },
]

export const steps = [
  {
    number: '01',
    title: 'Sign up',
    body: 'Create your account in a minute. Tell us whether you are Parent A or Parent B, and choose a password you will remember.',
  },
  {
    number: '02',
    title: 'Invite your co-parent',
    body: 'Send one invitation by email. When they accept, your shared calendar, expenses, handovers and documents open up for both of you.',
  },
  {
    number: '03',
    title: 'Start coordinating',
    body: 'Add the next school pick-up, log a handover, record a shared cost. Small, calm steps that quickly add up to a steadier week.',
  },
]

export const testimonials = [
  {
    name: 'Amina W.',
    role: 'Mother of one, Nairobi',
    quote:
      'We stopped arguing about pick-ups because the calendar simply tells us both. The first week felt strange, then it felt like breathing again.',
    photo: 'testimonialAmina' as PhotoKey,
    direction: 'left' as const,
  },
  {
    name: 'Brian O.',
    role: 'Father of one, Kiambu',
    quote:
      'The handover log changed how we speak to each other. It is not about winning a record, it is about both of us knowing our daughter is fine.',
    photo: 'testimonialBrian' as PhotoKey,
    direction: 'right' as const,
  },
  {
    name: 'Joseph K.',
    role: 'Father of two, Mombasa',
    quote:
      'School fees used to be a monthly argument. Now the split is written down before the term starts, and we both just pay our part.',
    photo: 'testimonialJoseph' as PhotoKey,
    direction: 'left' as const,
  },
]

export const faqs = [
  {
    question: 'Who can see what I write in Abigail Family?',
    answer:
      'Only the two parents in your family space. Your private journal is visible to you alone and is never shown to your co-parent. Our team does not read your messages or documents during normal operation, and your data is stored under the Kenya Data Protection Act 2019.',
  },
  {
    question: 'Does a handover log have legal standing in Kenya?',
    answer:
      'Handover logs are a dated, factual record that can support your account of events, and they can be useful evidence if a matter ever goes before the Children Court. They are not a court order and they are not legal advice. Speak to an advocate about how records should be used in your specific case.',
  },
  {
    question: 'What happens if my co-parent refuses to join?',
    answer:
      'You can still use your own calendar, expense record and private journal. Many parents keep a clear record for themselves first. If your co-parent later accepts the invitation, your shared history is already there and waiting.',
  },
  {
    question: 'Is my child\'s information safe?',
    answer:
      'Child data is the most sensitive data we hold. It is encrypted in transit, stored in access controlled infrastructure, and never sold or used for advertising. You can request export or deletion of your family data at any time by writing to our data protection contact.',
  },
  {
    question: 'How much does it cost?',
    answer:
      'The free plan covers the shared calendar and secure messaging, which is enough for many families. The Family Plan at KSh 799 per month adds expenses, handover logs, the document vault and the progress journal, with two months free if you pay annually.',
  },
  {
    question: 'Do we both need a smartphone?',
    answer:
      'No. Abigail Family works in any modern mobile browser and on a laptop. If one parent prefers WhatsApp for day to day chat, you can still keep the important record here, and use our WhatsApp line for support.',
  },
]

export const values = [
  {
    title: 'The child is not the prize',
    body: 'Nothing in the product rewards one parent for winning. Every screen is designed to reduce conflict, not to keep score.',
  },
  {
    title: 'Facts over feelings',
    body: 'Dates, amounts and condition notes are neutral. They let both parents work from the same information instead of memory.',
  },
  {
    title: 'Privacy is a promise',
    body: 'Journals stay private, documents are access controlled, and child data is never sold or used for advertising.',
  },
  {
    title: 'Dignity for both parents',
    body: 'No language that blames, shames or takes sides. Both parents are treated as people doing their best for their child.',
  },
]

export const pricingPlans = [
  {
    name: 'Free',
    price: 'KSh 0',
    cadence: 'forever',
    tagline: 'For parents finding their feet again.',
    features: [
      'Shared calendar for both parents',
      'Secure two-party messaging',
      'Two parent accounts',
      'Mobile and desktop access',
      'WhatsApp support',
    ],
    cta: 'Start free',
    href: '/register',
    highlighted: false,
  },
  {
    name: 'Family Plan',
    price: 'KSh 799',
    cadence: 'per month',
    tagline: 'The full coordination toolkit for one family.',
    features: [
      'Everything in the free plan',
      'Expense tracker with split percentages',
      'Handover logs with photo records',
      'Document vault with uploads',
      'Private progress journal for each parent',
      'Priority WhatsApp support',
    ],
    cta: 'Start the Family Plan',
    href: '/register?plan=family',
    highlighted: true,
  },
]
