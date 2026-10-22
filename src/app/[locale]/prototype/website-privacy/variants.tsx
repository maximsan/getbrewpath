'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import { PrototypeSwitcher } from '@components/prototype-switcher/prototype-switcher';
import { pageTitleClass } from '@components/section/section';
import { PAGE_ROUTES } from '@domains/site/routes';
import { EMAIL_HI } from '@domains/site/site';

/*
 * PROTOTYPE ONLY. Three drafts of the website privacy page on one route,
 * switchable via `?variant=`:
 *   A  Short notice: one screen, no sections, links to the app's policy for the rest.
 *   B  Full notice: numbered sections in the legal-document look, stands on its own.
 *   C  Questions: each heading is a visitor's question.
 */

const VARIANTS = [
  { key: 'A', name: 'Short notice' },
  { key: 'B', name: 'Full notice' },
  { key: 'C', name: 'Questions' },
] as const;

const p = 'ff-ui mt-0 mb-3.5 text-base leading-[1.7] text-pretty text-ink';
const h2 = 'ff-display m-0 mb-3.5 text-[26px] leading-[1.15] font-normal tracking-[-0.015em]';
const h3 = 'ff-ui mt-6 mb-2.5 text-base font-semibold text-ink';
const dated = 'ff-mono mt-5 text-[11px] tracking-[.1em] text-ink-mute uppercase';
const link = 'underline underline-offset-2';

const OPERATOR = 'Maksim Shchutski, a sole proprietor registered in Poland';

const PolicyLink = ({ children, hash }: { children: ReactNode; hash?: string }) => (
  <a href={`${PAGE_ROUTES.privacy}${hash ? `#${hash}` : ''}`} className={link}>
    {children}
  </a>
);

const Email = () => (
  <a href={`mailto:${EMAIL_HI}`} translate="no" className={link}>
    {EMAIL_HI}
  </a>
);

function Page({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[768px] px-6 pt-[clamp(40px,6vw,72px)] pb-24">
      <h1 className={pageTitleClass}>{title}</h1>
      <div className={dated}>Last updated: [launch date]</div>
      <div className="mt-10 max-w-[68ch]">{children}</div>
    </section>
  );
}

/* ---------- A: Short notice ---------- */

function VariantA() {
  return (
    <Page title="Website privacy">
      <p className={p}>
        This page is about getbrewpath.com, the website. The BrewPath app has its own{' '}
        <PolicyLink>Privacy Policy</PolicyLink>.
      </p>
      <p className={p}>
        The website is run by {OPERATOR}. You can reach us at <Email />.
      </p>
      <p className={p}>The website sets no cookies and stores nothing in your browser.</p>
      <p className={p}>
        We count visits with Cloudflare Web Analytics. Its script sends Cloudflare the address of
        the page you opened, the page you came from, and how fast the page loaded. Cloudflare
        drops your IP address at the data centre nearest to you, so we never see it. We see
        totals only, such as how many people opened a page in a week.
      </p>
      <p className={p}>
        Cloudflare also serves every page of this website, so each page request passes through
        it.{' '}
        Cloudflare sees your IP address while it delivers the page and handles it under its own
          privacy policy, as our data processor. We keep no log of page requests ourselves.
      </p>
      <p className={p}>
        If you email us, we receive your email address and what you wrote. We use them only to
        reply, and keep the exchange as long as it takes to resolve it and keep a record.
      </p>
      <p className={p}>
        Links to the App Store take you to Apple, where Apple&apos;s privacy policy applies.
      </p>
      <p className={p}>
        Your rights over your personal data are the ones listed in the app&apos;s Privacy
        Policy under <PolicyLink hash="doc-s8">Your Privacy Rights</PolicyLink>. To use them,
        write to <Email />.
      </p>
      <p className={p}>When this page changes, the date at the top changes with it.</p>
    </Page>
  );
}

/* ---------- B: Full notice ---------- */

function NumberedSection({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="pb-10">
      <div className="ff-mono mb-2 text-[11px] tracking-[.14em] text-accent uppercase">
        {String(n).padStart(2, '0')}
      </div>
      <h2 className={h2}>{title}</h2>
      {children}
    </div>
  );
}

function VariantB() {
  return (
    <Page title="Website Privacy Notice">
      <p className={`${p} text-ink-mute`}>
        This notice explains what happens to your information when you visit getbrewpath.com.
      </p>
      <NumberedSection n={1} title="Who runs this website">
        <p className={p}>
          getbrewpath.com is run by {OPERATOR} (&quot;we&quot;, &quot;us&quot;). Email:{' '}
          <Email />.
        </p>
      </NumberedSection>
      <NumberedSection n={2} title="What this notice covers">
        <p className={p}>
          This notice covers the website only. The BrewPath app has its own{' '}
          <PolicyLink>Privacy Policy</PolicyLink>, which describes what the app does with your
          information.
        </p>
      </NumberedSection>
      <NumberedSection n={3} title="Cookies and browser storage">
        <p className={p}>
          The website sets no cookies. It stores nothing in your browser, and it does not ask
          for consent because there is nothing to consent to.
        </p>
      </NumberedSection>
      <NumberedSection n={4} title="Visit counting">
        <p className={p}>
          We count visits with Cloudflare Web Analytics, a service of Cloudflare, Inc. A small
          script on every page sends Cloudflare:
        </p>
        <ul className={`${p} list-disc ps-5`}>
          <li>the address of the page you opened;</li>
          <li>the address of the page you came from, if your browser passes it on;</li>
          <li>how fast the page loaded and responded.</li>
        </ul>
        <p className={p}>
          The script stores nothing in your browser. Cloudflare drops your IP address at the
          data centre nearest to you. We see totals only: how many people opened a page, from
          which countries, in which browsers.
        </p>
        <p className={p}>
          Cloudflare keeps the counted visits for six months. After seven days it keeps only a
          sample of them.
        </p>
      </NumberedSection>
      <NumberedSection n={5} title="Hosting">
        <p className={p}>
          Cloudflare serves every page of this website, so each page request passes through
          Cloudflare&apos;s network.{' '}
          Cloudflare sees your IP address while it delivers the page and handles it under its own
          privacy policy, as our data processor. We keep no log of page requests ourselves.
        </p>
      </NumberedSection>
      <NumberedSection n={6} title="Emailing us">
        <p className={p}>
          If you email us, we receive your email address and the contents of your message. We
          use them only to reply to you and resolve what you wrote about.
        </p>
        <p className={p}>
          We keep the exchange for as long as it takes to resolve it and to keep a reasonable
          record.
        </p>
      </NumberedSection>
      <NumberedSection n={7} title="Links to other services">
        <p className={p}>
          Links to the App Store take you to Apple, where Apple&apos;s privacy policy and terms
          apply. Links that open the BrewPath app are covered by the app&apos;s Privacy Policy.
        </p>
      </NumberedSection>
      <NumberedSection n={8} title="Your rights">
        <p className={p}>
          Depending on where you live, privacy laws may give you rights over your personal
          data. You may ask what we hold about you, have it corrected or deleted, or complain to
          a data protection authority.
        </p>
        <p className={p}>
          The website holds no personal data about visitors. The only personal data we may hold
          is an email exchange you started. To use your rights, write to <Email />.
        </p>
      </NumberedSection>
      <NumberedSection n={9} title="Changes to this notice">
        <p className={p}>
          We update this notice when the website changes how it handles information. The date
          at the top shows the latest version.
        </p>
      </NumberedSection>
      <NumberedSection n={10} title="Contact">
        <p className={p} translate="no">
          <span className="block">Maksim Shchutski</span>
          <span className="block">Sole proprietor, Poland</span>
          <span className="block">Website: getbrewpath.com</span>
          <span className="block">
            Email: <Email />
          </span>
        </p>
      </NumberedSection>
    </Page>
  );
}

/* ---------- C: Questions ---------- */

function Question({ q, children }: { q: string; children: ReactNode }) {
  return (
    <div className="pb-8">
      <h2 className={h3}>{q}</h2>
      {children}
    </div>
  );
}

function VariantC() {
  return (
    <Page title="Privacy on this website">
      <p className={`${p} text-ink-mute`}>
        Short answers about what getbrewpath.com does with your information.
      </p>
      <Question q="Who runs getbrewpath.com?">
        <p className={p}>
          {OPERATOR}. Email <Email />.
        </p>
      </Question>
      <Question q="Does the website set cookies?">
        <p className={p}>No. It stores nothing in your browser.</p>
      </Question>
      <Question q="What does the website learn when I visit?">
        <p className={p}>
          That a page was opened. We count visits with Cloudflare Web Analytics. Its script sends
          Cloudflare the page address, the page you came from and how fast the page loaded.
          Cloudflare drops your IP address at the nearest data centre. We see totals, never
          individual visitors.
        </p>
      </Question>
      <Question q="What does Cloudflare keep?">
        <p className={p}>
          Cloudflare serves every page of this website.{' '}
          Cloudflare sees your IP address while it delivers the page and handles it under its own
          privacy policy, as our data processor. We keep no log of page requests ourselves.
        </p>
      </Question>
      <Question q="What happens when I email you?">
        <p className={p}>
          We receive your address and your message, and use them only to reply. We keep the
          exchange as long as it takes to resolve it and keep a record.
        </p>
      </Question>
      <Question q="Does this page cover the app?">
        <p className={p}>
          No. The BrewPath app has its own <PolicyLink>Privacy Policy</PolicyLink>. Links to the
          App Store take you to Apple, where Apple&apos;s privacy policy applies.
        </p>
      </Question>
      <Question q="What are my rights?">
        <p className={p}>
          Depending on where you live, you may ask what personal data we hold about you, have it
          corrected or deleted, or complain to a data protection authority. The website itself
          holds none; an email exchange you started is the only personal data we may hold. Write
          to <Email />.
        </p>
      </Question>
      <Question q="How will I know if this page changes?">
        <p className={p}>The date at the top changes with it.</p>
      </Question>
    </Page>
  );
}

export function WebsitePrivacyVariants() {
  const variant = useSearchParams().get('variant') ?? 'A';
  return (
    <>
      {variant === 'A' && <VariantA />}
      {variant === 'B' && <VariantB />}
      {variant === 'C' && <VariantC />}
      <PrototypeSwitcher variants={VARIANTS} />
    </>
  );
}
