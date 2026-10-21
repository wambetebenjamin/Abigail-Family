import type { Metadata } from 'next'
import LegalShell from '@/components/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Abigail Family handles parent and child data under the Kenya Data Protection Act 2019, including the special protection we apply to children.',
}

export default function PrivacyPolicyPage() {
  return (
    <LegalShell
      title="Privacy Policy"
      intro="This policy explains what data Abigail Family collects, why we need it, how long we keep it and the rights you have under the Kenya Data Protection Act 2019 (KDPA). We have written it in plain language on purpose. If any part is unclear, ask us and we will explain it."
    >
      <h2>1. Who we are</h2>
      <p>
        Abigail Family is a co-parenting coordination platform operated in Nairobi, Kenya. For the
        purposes of the KDPA, Abigail Family is the data controller for the personal data described
        in this policy. Our data protection contact is dpo@abigailfamily.co.ke. We are registered as
        a data controller with the Office of the Data Protection Commissioner (ODPC).
      </p>

      <h2>2. The data we collect</h2>
      <ul>
        <li>
          <strong>Account data:</strong> your name, email address, password (stored as a salted
          hash, never in plain text) and whether you are labelled Parent A or Parent B in your family
          space.
        </li>
        <li>
          <strong>Coordination data:</strong> calendar events, shared expenses, handover records,
          messages, documents you upload and journal entries you write.
        </li>
        <li>
          <strong>Child data:</strong> the name or initials of your child if you include them in an
          event, note or journal, their schedule, shared costs, handover condition notes, documents
          such as school reports or medical records, and photographs you choose to upload.
        </li>
        <li>
          <strong>Technical data:</strong> limited log data such as timestamps and error diagnostics,
          and the reCAPTCHA score returned by Google when you submit a form.
        </li>
        <li>
          <strong>Support data:</strong> anything you send us through the enquiry form, email or
          WhatsApp.
        </li>
      </ul>

      <h2 id="children">3. Children's data: the highest standard we apply</h2>
      <p>
        Children's data is special category data in spirit even where the KDPA does not say so
        expressly. We treat it accordingly:
      </p>
      <ul>
        <li>
          We only process child data on the instruction of a parent or guardian with parental
          responsibility, and only to coordinate that child's care.
        </li>
        <li>
          We do not create advertising profiles of children, we do not sell child data, and we do not
          use child data to train marketing models.
        </li>
        <li>
          Photographs in handover logs and documents are visible only inside the family space, and
          only to the two parents in that space.
        </li>
        <li>
          The progress journal is private to the parent who wrote it. It is never shown to the other
          parent, and our support team does not read it during normal operation.
        </li>
        <li>
          We keep child data only as long as the family account is active, or as long as the law
          requires for a specific record. You can ask us to delete a child's data at any time.
        </li>
        <li>
          We never ask a child to create an account. Abigail Family accounts are for adults aged 18
          and over.
        </li>
      </ul>

      <h2>4. Why we process your data and our lawful basis</h2>
      <ul>
        <li>
          <strong>To provide the service (contract):</strong> creating your account, sharing your
          calendar with your co-parent, storing your documents and delivering your messages.
        </li>
        <li>
          <strong>To keep the platform safe (legitimate interest):</strong> preventing abuse,
          verifying forms with reCAPTCHA and diagnosing faults.
        </li>
        <li>
          <strong>With your consent:</strong> optional analytics and marketing cookies, and any
          optional emails you opt into. You can withdraw consent at any time.
        </li>
        <li>
          <strong>To meet legal obligations:</strong> responding to a valid court order or a lawful
          request from a competent authority, and keeping billing records where required.
        </li>
      </ul>

      <h2>5. Who we share data with</h2>
      <p>
        We do not sell personal data. We share it only with service providers who help us run the
        platform under written data processing terms:
      </p>
      <ul>
        <li>Vercel, for hosting, serverless functions, blob storage and KV storage.</li>
        <li>Google reCAPTCHA, to distinguish people from automated abuse.</li>
        <li>Our email provider, to deliver invitations, welcome emails and enquiry replies.</li>
        <li>
          Your co-parent, but only for the shared parts of the family space. Your email address,
          password and private journal are never shared with them.
        </li>
        <li>
          A competent authority, only where we are legally required to do so and after checking the
          request is valid.
        </li>
      </ul>

      <h2>6. International transfers</h2>
      <p>
        Our infrastructure providers may process data outside Kenya, including in the European Union
        and the United States. Where that happens we rely on appropriate safeguards, including
        standard contractual clauses, and we keep child data to the minimum needed for the service.
      </p>

      <h2>7. How long we keep data</h2>
      <p>
        Account and coordination data are kept while your family account is active. If you delete your
        account, we remove your personal data within 30 days, except where we must keep a record for
        tax, fraud prevention or a legal obligation. Backups are purged on a rolling 35 day cycle.
        Enquiry emails are kept for 24 months.
      </p>

      <h2>8. Your rights under the KDPA 2019</h2>
      <p>You have the right to:</p>
      <ul>
        <li>be informed about how your data is used;</li>
        <li>access a copy of the personal data we hold about you;</li>
        <li>correct data that is inaccurate or incomplete;</li>
        <li>request deletion of data we no longer need;</li>
        <li>object to processing based on legitimate interest;</li>
        <li>receive your data in a portable format;</li>
        <li>withdraw consent for optional processing at any time.</li>
      </ul>
      <p>
        Write to dpo@abigailfamily.co.ke and we will respond within 7 days, and in any event within
        the period allowed by the KDPA. We may need to verify your identity first, especially where a
        request involves a child's data. If you are unhappy with our response you can complain to the
        Office of the Data Protection Commissioner.
      </p>

      <h2>9. Security</h2>
      <p>
        Data is encrypted in transit, passwords are hashed with a salted key derivation function, and
        access to production systems is limited to the two engineers who need it. No system is
        perfect. If a breach occurs that is likely to result in a risk to your rights, we will notify
        you and the ODPC without undue delay, as the KDPA requires.
      </p>

      <h2>10. Cookies and local storage</h2>
      <p>
        We use strictly necessary cookies to keep you signed in, and optional functional, analytics
        and marketing cookies only with your consent. Our{' '}
        <a href="/legal/cookie-policy" className="text-primary underline underline-offset-2">
          cookie policy
        </a>{' '}
        lists every item and how to change your choice.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        If we make a material change we will tell you in the app and by email before it takes effect.
        The date at the top of this page always shows the current version.
      </p>

      <h2>12. Contact</h2>
      <p>
        Abigail Family, Nairobi, Kenya. Data protection contact: dpo@abigailfamily.co.ke. WhatsApp:
        +254 112 272 061.
      </p>
    </LegalShell>
  )
}
