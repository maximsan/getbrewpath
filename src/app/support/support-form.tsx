'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useActionState, useId, useState } from 'react';

import { TextField } from '@components/brewpath/text-field/text-field';
import { CheckIcon } from '@components/icons/icons';
import { EMAIL_HELLO } from '@domains/site/site';
import { MAX_MESSAGE_LENGTH } from '@domains/support/support-message';

import { submitSupportMessage, type SupportFormState } from './actions';

const IDLE: SupportFormState = { status: 'idle' };

/** The contact form; it emails the team through a server action. */
export function SupportForm() {
  const [email, setEmail] = useState('');
  /** Bumped by "Send another": the form remounts empty, keeping the reply address. */
  const [round, setRound] = useState(0);

  return (
    <SupportFormRound
      key={round}
      email={email}
      onEmailChange={setEmail}
      onSendAnother={() => setRound((current) => current + 1)}
    />
  );
}

interface SupportFormRoundProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSendAnother: () => void;
}

function SupportFormRound({ email, onEmailChange, onSendAnother }: SupportFormRoundProps) {
  const t = useTranslations('support');
  const [state, submit, pending] = useActionState(submitSupportMessage, IDLE);
  const [message, setMessage] = useState('');
  const ids = { email: useId(), message: useId() };

  if (state.status === 'sent') {
    return (
      <div className="flex animate-save-note-in flex-col items-center gap-3 rounded-3xl border border-[color-mix(in_oklab,var(--sage)_50%,var(--rule))] bg-surface px-7 py-9 text-center">
        <span className="inline-flex text-sage">
          <CheckIcon size={28} />
        </span>
        <h3 className="ff-display m-0 text-[26px] leading-[1.1] font-normal">{t('sentTitle')}</h3>
        <p
          role="status"
          className="ff-ui m-0 max-w-[34ch] text-sm leading-[1.55] wrap-anywhere text-ink-mute"
        >
          {t('sentBody', { email: state.email })}
        </p>
        <button
          type="button"
          onClick={onSendAnother}
          className="ff-ui mt-2 min-h-10 appearance-none rounded-full border border-rule bg-transparent px-[18px] py-2 text-sm leading-[1.15] font-medium text-ink"
        >
          {t('another')}
        </button>
      </div>
    );
  }

  const errors = state.status === 'invalid' ? state.errors : {};
  const formError =
    state.status === 'failed'
      ? t('errors.failed', { email: EMAIL_HELLO })
      : state.status === 'rate-limited'
        ? t('errors.rateLimited')
        : null;

  return (
    <form
      action={submit}
      noValidate
      className="flex flex-col gap-4 rounded-3xl border border-rule bg-surface p-7"
    >
      <label htmlFor={ids.email} className="smallcaps">
        {t('yourEmail')}
      </label>
      <TextField
        id={ids.email}
        name="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={onEmailChange}
        placeholder={t('emailPlaceholder')}
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? `${ids.email}-error` : undefined}
      />
      {errors.email && <FieldMessage id={`${ids.email}-error`}>{t('errors.email')}</FieldMessage>}

      <label htmlFor={ids.message} className="smallcaps mt-1.5">
        {t('what')}
      </label>
      <textarea
        id={ids.message}
        name="message"
        required
        rows={5}
        maxLength={MAX_MESSAGE_LENGTH}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={t('messagePlaceholder')}
        aria-invalid={errors.message ? true : undefined}
        aria-describedby={errors.message ? `${ids.message}-error` : undefined}
        className="ff-ui w-full resize-y rounded-xl border border-rule bg-surface px-4 py-3.5 text-[15px] leading-normal text-ink outline-none placeholder:text-ink-mute focus:border-accent"
      />
      {errors.message && (
        <FieldMessage id={`${ids.message}-error`}>
          {t(`errors.${errors.message}`, { max: MAX_MESSAGE_LENGTH })}
        </FieldMessage>
      )}

      {/* Hidden from people; bots that fill it in are dropped (see parseSupportMessage). */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <button type="submit" disabled={pending} className="btn btn-primary mt-1">
        {pending ? t('sending') : t('send')}
      </button>
      <div role="alert" className="empty:hidden">
        {formError && <FieldMessage>{formError}</FieldMessage>}
      </div>
      <p className="ff-ui m-0 text-xs leading-normal text-ink-mute">
        {t.rich('consent', { link: (chunks) => <Link href="/privacy">{chunks}</Link> })}
      </p>
    </form>
  );
}

function FieldMessage({ id, children }: { id?: string; children: string }) {
  return (
    <p id={id} className="ff-ui m-0 text-[13px] leading-normal text-berry">
      {children}
    </p>
  );
}
