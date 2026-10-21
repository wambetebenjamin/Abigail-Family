type Mail = {
  to: string
  subject: string
  text: string
  replyTo?: string
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
}

async function deliver({ to, subject, text, replyTo }: Mail) {
  if (!smtpConfigured()) {
    console.info(`[email] SMTP not configured, enquiry captured for ${to}: ${subject}`)
    return { delivered: false, reason: 'smtp-not-configured' as const }
  }
  try {
    const nodemailer = await import('nodemailer')
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT || 587) === 465,
      auth: { user: process.env.SMTP_USER as string, pass: process.env.SMTP_PASS as string },
    })
    await transport.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      text,
      replyTo,
    })
    return { delivered: true as const }
  } catch (error) {
    console.error('[email] delivery failed', error)
    return { delivered: false, reason: 'delivery-failed' as const }
  }
}

export async function sendEnquiryEmail(input: {
  name: string
  email: string
  phone?: string
  topic?: string
  message: string
}) {
  const to = process.env.SMTP_FROM || 'hello@abigailfamily.co.ke'
  return deliver({
    to,
    subject: `New enquiry: ${input.topic || 'General'}`,
    replyTo: input.email,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Phone: ${input.phone || 'Not shared'}`,
      `Topic: ${input.topic || 'General enquiry'}`,
      '',
      input.message,
    ].join('\n'),
  })
}

export async function sendInviteEmail(input: { to: string; fromName: string; familyName: string }) {
  return deliver({
    to: input.to,
    subject: `${input.fromName} invited you to ${input.familyName} on Abigail Family`,
    text: [
      `${input.fromName} has started a shared family space for ${input.familyName}.`,
      '',
      'Open the invitation link to create your own account, then you can see the shared calendar, expenses and handover log.',
      '',
      'Abigail Family, raising children together, apart.',
    ].join('\n'),
  })
}

export async function sendRegistrationWelcome(input: { to: string; name: string }) {
  return deliver({
    to: input.to,
    subject: 'Welcome to Abigail Family',
    text: [
      `Hello ${input.name},`,
      '',
      'Your family space is ready. Take one small step today: add the next school pick-up to the shared calendar.',
      '',
      'We are here on WhatsApp if you need anything.',
    ].join('\n'),
  })
}
