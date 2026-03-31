import { describe, it, expect } from 'vitest';
import { getErrorMessage } from './errors';

describe('getErrorMessage', () => {
  it('extracts backend error field', () => {
    const axiosError = {
      response: { data: { error: 'Username already exists' } },
    };
    expect(getErrorMessage(axiosError)).toBe('Username already exists');
  });

  it('falls back to Error.message', () => {
    expect(getErrorMessage(new Error('Network error'))).toBe('Network error');
  });

  it('uses custom fallback for null', () => {
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback');
  });

  it('uses default fallback for undefined', () => {
    expect(getErrorMessage(undefined)).toBe('Something went wrong');
  });

  it('handles error without response', () => {
    const error = { message: 'timeout' };
    expect(getErrorMessage(error)).toBe('Something went wrong');
  });
});
