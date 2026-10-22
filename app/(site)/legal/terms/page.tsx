import type { Metadata } from 'next'
import LegalShell from '@/components/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description:
    'The terms that govern your use of Abigail Family, including the clear statement that we are not a substitute for legal counsel.',
}

export default function TermsPage() {
  return (
    <LegalShell
      title="Terms of Use"
      intro="These terms govern your use of Abigail Family. By creating an account you accept them. We have kept them as short and as readable as we can, because terms nobody reads protect nobody."
    >
      <h2>1. Who can use Abigail Family</h2>
      <p>
        You must be at least 18 years old and have parental responsibility for the child whose care
        you are coordinating. You must provide accurate information and keep your login details
        secure. One account per person.
      </p>

      <h2>2. What the service is</h2>
      <p>
        Abigail Family is a coordination tool. It helps two parents share a calendar, record shared
        expenses, log handovers, exchange messages, store documents and keep a private journal. It is
        not a law firm, a mediator, a counsellor, a court or a substitute for any of them.
      </p>

      <h2>3. Not legal advice</h2>
      <p>
        Nothing in Abigail Family, including handover logs, expense records, guidance text or
        automated summaries, is legal advice. Records you create may support your account of events,
        but they are not a court order and they do not create rights or obligations that a court
        would enforce. For advice about custody, maintenance or any family law matter in Kenya,
        consult an advocate of the High Court of Kenya. If you are in immediate danger, contact the
        Kenya Police Service or the child helpline on 116.
      </p>

      <h2>4. Your content and responsibilities</h2>
      <ul>
        <li>You keep ownership of the content you add. You grant us the limited licence needed to store and display it to you and, for shared items, to your co-parent.</li>
        <li>You are responsible for the accuracy of what you record and for having the right to upload any document or photograph.</li>
        <li>Do not upload unlawful material, another person's private information without their consent, or content that is abusive, threatening or harassing.</li>
        <li>Do not use the platform to monitor, track or intimidate the other parent.</li>
        <li>Do not attempt to access another family's data, probe our security or interfere with the service.</li>
      </ul>
      <p>
        We may suspend an account that we reasonably believe is being used to harm a child or another
        person, and we may report serious concerns to the relevant authorities.
      </p>

      <h2>5. Inviting your co-parent</h2>
      <p>
        When you invite your co-parent, we send them one email. We do not add them to marketing lists.
        Until they accept, they cannot see the family space. You must not invite someone who does not
        have parental responsibility for the child.
      </p>

      <h2>6. Plans, billing and cancellation</h2>
      <ul>
        <li>The free plan includes the shared calendar and secure messaging, at no cost.</li>
        <li>The Family Plan is billed in Kenya shillings at KSh 799 per month, or KSh 7,990 per year. Prices include VAT.</li>
        <li>Paid plans renew automatically until cancelled. Cancelling stops the next renewal and keeps your access until the end of the period you paid for.</li>
        <li>If a payment fails we may pause paid features after a short grace period. Your data stays available to export.</li>
        <li>We may change prices with at least 30 days notice. You can cancel before the change takes effect.</li>
      </ul>

      <h2>7. Availability and changes to the service</h2>
      <p>
        We work to keep the platform available, but we do not promise uninterrupted service. We may
        change or retire features, and we will give reasonable notice of material changes. Planned
        maintenance is announced in the app where possible.
      </p>

      <h2>8. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by Kenyan law, Abigail Family is not liable for indirect or
        consequential loss, loss of profits, or loss arising from decisions you make about your
        family, including custody, maintenance or parenting arrangements. Our total liability for any
        claim relating to the service is limited to the amount you paid us in the 12 months before
        the claim. Nothing in these terms limits liability that cannot lawfully be limited.
      </p>

      <h2>9. Termination</h2>
      <p>
        You can close your account at any time from the dashboard or by writing to us. We will delete
        your personal data in line with our privacy policy. We may terminate an account for a material
        breach of these terms, or where we are required to by law.
      </p>

      <h2>10. Governing law and disputes</h2>
      <p>
        These terms are governed by the laws of Kenya. We will try to resolve any dispute through
        good faith discussion first. If that fails, the courts of Kenya have exclusive jurisdiction.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about these terms: hello@abigailfamily.co.ke or WhatsApp +254 112 272 061. Abigail
        Family, Nairobi, Kenya.
      </p>
    </LegalShell>
  )
}
