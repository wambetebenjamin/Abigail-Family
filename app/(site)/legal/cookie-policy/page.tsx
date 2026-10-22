import type { Metadata } from 'next'
import LegalShell from '@/components/legal/LegalShell'

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description:
    'Every cookie and local storage item Abigail Family uses, why it exists, and how to change your choices under the Kenya Data Protection Act 2019.',
}

export default function CookiePolicyPage() {
  return (
    <LegalShell
      title="Cookie Policy"
      intro="Cookies are small files a website stores in your browser. We also use browser local storage for a few preferences. This page lists every item we use, what it does and how long it stays. It should take two minutes to read."
    >
      <h2>1. Our approach</h2>
      <p>
        We use the smallest number of cookies that lets the platform work. Necessary cookies are set
        because the service cannot function without them. Functional, analytics and marketing cookies
        are set only if you choose them in the consent banner. We never use cookies to build
        advertising profiles of children.
      </p>

      <h2>2. Necessary cookies</h2>
      <ul>
        <li>
          <strong>next-auth.session-token</strong> (cookie, essential): keeps you signed in to your
          family space. Expires when you sign out or after 30 days. Without it you would have to log in
          on every page.
        </li>
        <li>
          <strong>next-auth.csrf-token</strong> (cookie, essential): protects sign-in forms against
          cross-site request forgery. Session length.
        </li>
        <li>
          <strong>__Host-next-auth.csrf-token</strong> (cookie, essential): the secure variant used on
          HTTPS deployments. Session length.
        </li>
      </ul>

      <h2>3. Functional storage</h2>
      <ul>
        <li>
          <strong>abigail-family-cookie-consent</strong> (local storage, 12 months): remembers your
          cookie choices so we do not ask again on every visit.
        </li>
        <li>
          <strong>abigail-family-loader-seen</strong> (session storage): stops the branded loading
          screen appearing on every page you open in the same visit.
        </li>
        <li>
          <strong>abigail-family-voice-tour-played</strong> (session storage): remembers that you
          already heard the voice tour so it does not start on its own again.
        </li>
      </ul>

      <h2>4. Analytics</h2>
      <p>
        If you accept analytics cookies, we use Vercel Analytics and Speed Insights to count page
        views and measure loading performance. These are aggregated and do not include the content of
        your calendar, messages, expenses or journal. They are off until you accept them.
      </p>

      <h2>5. Marketing</h2>
      <p>
        Marketing cookies are off by default. We do not currently run advertising campaigns, and we
        will never use child data or family content to target an advert. If we ever test a campaign we
        will say so here and keep the setting opt-in.
      </p>

      <h2>6. Third-party cookies</h2>
      <ul>
        <li>
          <strong>Google reCAPTCHA</strong> sets cookies such as _GRECAPTCHA to tell people from
          automated abuse on our forms. This is part of keeping the platform safe.
        </li>
        <li>
          <strong>Google Fonts</strong> delivers the Dosis and Overpass typefaces. Font requests do not
          set advertising cookies.
        </li>
        <li>
          <strong>Vercel</strong> may set short-lived infrastructure cookies for routing and security.
        </li>
      </ul>

      <h2>7. Changing your choice</h2>
      <p>
        Open the consent banner by clearing the abigail-family-cookie-consent item in your browser
        storage, then reload the page. You can also block or delete cookies in your browser settings.
        Blocking necessary cookies will stop sign-in and the dashboard from working.
      </p>

      <h2>8. Your rights</h2>
      <p>
        Cookie data is personal data under the Kenya Data Protection Act 2019. You can withdraw
        consent at any time using the steps above, ask us what we hold, or complain to the Office of
        the Data Protection Commissioner. Our privacy policy explains those rights in full.
      </p>

      <h2>9. Children</h2>
      <p>
        We do not knowingly set any cookie on a child's device, because children do not have accounts
        on Abigail Family. The only child data we hold is what a parent chooses to add inside a family
        space.
      </p>

      <h2>10. Contact</h2>
      <p>
        Questions about cookies: dpo@abigailfamily.co.ke or WhatsApp +254 112 272 061.
      </p>
    </LegalShell>
  )
}
