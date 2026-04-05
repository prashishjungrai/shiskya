export function getApiErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null) {
    const maybeResponse = (error as { response?: { data?: { detail?: string } } }).response;
    if (typeof maybeResponse?.data?.detail === "string" && maybeResponse.data.detail.trim()) {
      return maybeResponse.data.detail;
    }

    const maybeMessage = (error as { message?: string }).message;
    if (typeof maybeMessage === "string" && maybeMessage.trim()) {
      return maybeMessage;
    }
  }

  return fallback;
}
