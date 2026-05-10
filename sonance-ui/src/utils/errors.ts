import type { AxiosError } from 'axios';

/**
 * Extracts a human-readable error message from an API error.
 *
 * Tries in order:
 * 1. Backend's ErrorResponse.error field (our @ControllerAdvice format)
 * 2. Axios error message
 * 3. Generic fallback
 *
 * This centralizes error extraction — no more `(error as any)?.response?.data?.error`
 * scattered across components.
 */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong'): string {
  if (!error) return fallback;

  // Backend ErrorResponse format: { status, error, path, timestamp }
  const axiosError = error as AxiosError<{ error?: string }>;
  if (axiosError?.response?.data?.error) {
    return axiosError.response.data.error;
  }

  // Axios network error or generic Error
  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
