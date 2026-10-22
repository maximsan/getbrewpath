'use client';

import { useSearchParams } from 'next/navigation';
import type { ReactNode } from 'react';

import { PrototypeSwitcher } from '@components/prototype-switcher/prototype-switcher';
import { pageTitleClass } from '@components/section/section';

/*
 * PROTOTYPE ONLY. Three ways to put crash reports into the app's Privacy Policy,
 * switchable via `?variant=`. Each shows only the sections that change, old text
 * beside new:
 *   A  Minimal amendment: reword "Analytics and Advertising", list Firebase under
 *      "Third-Party Services".
 *   B  Crash reports as a kind of information: a subsection under "Information
 *      BrewPath Handles", with retention and use listed where the policy lists them.
 *   C  One section: a new "Crash Reports" section that holds everything in one place.
 * Unchanged sections are not shown.
 */

const VARIANTS = [
  { key: 'A', name: 'Minimal amendment' },
  { key: 'B', name: 'Crash reports as a kind of information' },
  { key: 'C', name: 'One section' },
] as const;

const p = 'ff-ui mt-0 mb-3.5 text-base leading-[1.7] text-pretty text-ink';
const h2 = 'ff-display m-0 mb-3.5 text-[26px] leading-[1.15] font-normal tracking-[-0.015em]';
const h3 = 'ff-ui mt-6 mb-2.5 text-base font-semibold text-ink';
const label = 'ff-mono mb-2 text-[11px] tracking-[.14em] uppercase';

/* Facts, filled from docs/research/firebase-crashlytics-data.md. */
const CRASH_REPORT_HOLDS =
  'what failed and where in the App, the App version, the device model and operating system version, whether the device is jailbroken, free memory and disk space, screen orientation, whether the App was in the background, and the time';
const CRASH_ID =
  'A crash report carries random installation identifiers that Firebase creates for your installation of BrewPath; they change when you reinstall the App. It carries no name, email address or account, because BrewPath has none. When the App starts, Firebase also receives the App version, the operating system version and the type of network connection, so that crash reports from one session can be told apart.';
const RETENTION =
  'Google keeps crash reports for 90 days';

function Old({ children }: { children: ReactNode }) {
  return (
    <div className="mb-4 rounded-xl border border-rule p-4 opacity-70">
      <div className={`${label} text-ink-mute`}>Old</div>
      {children}
    </div>
  );
}

function New({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 rounded-xl border border-accent p-4">
      <div className={`${label} text-accent`}>New</div>
      {children}
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <div className="pb-6">
      <div className={`${label} text-accent`}>{n}</div>
      <h2 className={h2}>{title}</h2>
      {children}
    </div>
  );
}

function Page({ summary, children }: { summary: string; children: ReactNode }) {
  return (
    <section className="mx-auto max-w-[768px] px-6 pt-[clamp(40px,6vw,72px)] pb-24">
      <h1 className={pageTitleClass}>Privacy Policy: crash reports</h1>
      <p className={`${p} mt-6 text-ink-mute`}>{summary}</p>
      <div className="mt-10 max-w-[68ch]">{children}</div>
    </section>
  );
}

/* The current text, quoted from src/messages/en/site.json. */

const OLD_S2 = (
  <Old>
    <p className={p}>
      At this time, BrewPath does not use third-party product analytics or crash analytics
      services.
    </p>
    <p className={p}>
      BrewPath does not display third-party advertising and does not use your information for
      cross-app advertising tracking.
    </p>
    <p className={p}>
      If we introduce analytics or other data-processing services in the future, this Privacy
      Policy will be updated before or when those practices are introduced.
    </p>
  </Old>
);

const OLD_S5_INTRO = (
  <Old>
    <p className={p}>BrewPath currently relies on the following third-party services:</p>
    <h3 className={h3}>Apple</h3>
    <p className={p}>…</p>
    <h3 className={h3}>RevenueCat</h3>
    <p className={p}>…</p>
  </Old>
);

const OLD_S12_NOTE = (
  <Old>
    <p className={p}>
      This document describes BrewPath&apos;s current release-state privacy practices. It should
      be updated if analytics, crash reporting, advertising, account functionality, server-side
      push notifications, or other material data-processing features are introduced.
    </p>
  </Old>
);

const NEW_S12_NOTE = (
  <New>
    <p className={p}>
      This document describes BrewPath&apos;s current release-state privacy practices. It should
      be updated if analytics, advertising, account functionality, server-side push
      notifications, or other material data-processing features are introduced.
    </p>
  </New>
);

const FIREBASE_ENTRY = (
  <>
    <h3 className={h3}>Firebase Crashlytics</h3>
    <p className={p}>
      Firebase Crashlytics, a service of Google, receives BrewPath&apos;s crash reports so that
      we can find and fix errors. Google processes them on our behalf, which may happen outside
      your country of residence.
    </p>
  </>
);

/* ---------- A: Minimal amendment ---------- */

function VariantA() {
  return (
    <Page summary="Two sections change and the closing note loses one word. Crash reports are described inside the existing analytics section.">
      <Section n="02" title="Analytics and Advertising → Crash Reports, Analytics and Advertising">
        {OLD_S2}
        <New>
          <p className={p}>
            BrewPath sends a crash report to Firebase Crashlytics, a service of Google, when the
            App crashes or hits an error, so that we can find and fix it. A crash report holds{' '}
            {CRASH_REPORT_HOLDS}. {CRASH_ID} {RETENTION}.
          </p>
          <p className={p}>BrewPath does not use third-party product analytics.</p>
          <p className={p}>
            BrewPath does not display third-party advertising and does not use your information
            for cross-app advertising tracking.
          </p>
          <p className={p}>
            If we introduce analytics or other data-processing services in the future, this
            Privacy Policy will be updated before or when those practices are introduced.
          </p>
        </New>
      </Section>
      <Section n="05" title="Third-Party Services">
        {OLD_S5_INTRO}
        <New>
          <p className={p}>BrewPath currently relies on the following third-party services:</p>
          <h3 className={h3}>Apple</h3>
          <p className={p}>…</p>
          <h3 className={h3}>RevenueCat</h3>
          <p className={p}>…</p>
          {FIREBASE_ENTRY}
        </New>
      </Section>
      <Section n="12" title="Contact (closing note)">
        {OLD_S12_NOTE}
        {NEW_S12_NOTE}
      </Section>
    </Page>
  );
}

/* ---------- B: Crash reports as a kind of information ---------- */

function VariantB() {
  return (
    <Page summary="Crash reports become a kind of information the App handles, next to progress, purchases and support emails. Each later section that lists uses, services and retention gets one line for them.">
      <Section n="01" title="Information BrewPath Handles (new subsection, after Purchase information)">
        <New>
          <h3 className={h3}>Crash reports</h3>
          <p className={p}>
            When the App crashes or hits an error, it sends a crash report to Firebase
            Crashlytics, a service of Google, so that we can find and fix the problem.
          </p>
          <p className={p}>A crash report holds {CRASH_REPORT_HOLDS}.</p>
          <p className={p}>{CRASH_ID}</p>
        </New>
      </Section>
      <Section n="02" title="Analytics and Advertising">
        {OLD_S2}
        <New>
          <p className={p}>
            BrewPath does not use third-party product analytics. Crash reports are described
            above under Information BrewPath Handles.
          </p>
          <p className={p}>
            BrewPath does not display third-party advertising and does not use your information
            for cross-app advertising tracking.
          </p>
          <p className={p}>
            If we introduce analytics or other data-processing services in the future, this
            Privacy Policy will be updated before or when those practices are introduced.
          </p>
        </New>
      </Section>
      <Section n="04" title="How We Use Information (one new item)">
        <New>
          <ul className={`${p} list-disc ps-5`}>
            <li>…</li>
            <li>maintain the reliability and security of the App;</li>
            <li className="text-accent">find and fix crashes and errors;</li>
            <li>…</li>
          </ul>
        </New>
      </Section>
      <Section n="05" title="Third-Party Services (one new entry)">
        <New>{FIREBASE_ENTRY}</New>
      </Section>
      <Section n="07" title="Data Retention (one new paragraph)">
        <New>
          <p className={p}>{RETENTION}, after which they are deleted.</p>
        </New>
      </Section>
      <Section n="12" title="Contact (closing note)">
        {OLD_S12_NOTE}
        {NEW_S12_NOTE}
      </Section>
    </Page>
  );
}

/* ---------- C: One section ---------- */

function VariantC() {
  return (
    <Page summary="A new section holds everything about crash reports in one place: when one is sent, what it holds, who processes it and for how long. The analytics section shrinks to analytics and advertising.">
      <Section n="02" title="Analytics and Advertising">
        {OLD_S2}
        <New>
          <p className={p}>BrewPath does not use third-party product analytics.</p>
          <p className={p}>
            BrewPath does not display third-party advertising and does not use your information
            for cross-app advertising tracking.
          </p>
          <p className={p}>
            If we introduce analytics or other data-processing services in the future, this
            Privacy Policy will be updated before or when those practices are introduced.
          </p>
        </New>
      </Section>
      <Section n="03" title="Crash Reports (new section; later sections move down one)">
        <New>
          <p className={p}>
            When the App crashes or hits an error, it sends a crash report to Firebase
            Crashlytics, a service of Google, so that we can find and fix the problem.
          </p>
          <p className={p}>A crash report holds {CRASH_REPORT_HOLDS}.</p>
          <p className={p}>{CRASH_ID}</p>
          <p className={p}>
            Google processes crash reports on our behalf, which may happen outside your country
            of residence. {RETENTION}, after which they are deleted.
          </p>
        </New>
      </Section>
      <Section n="06" title="Third-Party Services (one new entry)">
        <New>
          <h3 className={h3}>Firebase Crashlytics</h3>
          <p className={p}>
            Firebase Crashlytics, a service of Google, receives BrewPath&apos;s crash reports.
            See Crash Reports above.
          </p>
        </New>
      </Section>
      <Section n="13" title="Contact (closing note)">
        {OLD_S12_NOTE}
        {NEW_S12_NOTE}
      </Section>
    </Page>
  );
}

export function CrashReportVariants() {
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
