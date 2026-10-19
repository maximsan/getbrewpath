import { describe, expect, it } from 'vitest';

import { MAX_MESSAGE_LENGTH, parseSupportMessage } from './support-message';

describe('parseSupportMessage', () => {
  it('trims and accepts a message with a reply address', () => {
    expect(parseSupportMessage({ email: ' you@example.com ', message: ' Hi ' })).toEqual({
      kind: 'valid',
      message: { email: 'you@example.com', message: 'Hi' },
    });
  });

  it('names each refused field', () => {
    expect(parseSupportMessage({ email: 'nope', message: '   ' })).toEqual({
      kind: 'invalid',
      errors: { email: 'email', message: 'message' },
    });
  });

  it('refuses a message over the length limit', () => {
    const message = 'a'.repeat(MAX_MESSAGE_LENGTH + 1);
    expect(parseSupportMessage({ email: 'you@example.com', message })).toEqual({
      kind: 'invalid',
      errors: { message: 'messageTooLong' },
    });
  });

  it('treats a filled hidden field as spam', () => {
    expect(
      parseSupportMessage({ email: 'bot@example.com', message: 'Buy', website: 'http://x' }),
    ).toEqual({ kind: 'spam' });
  });
});
