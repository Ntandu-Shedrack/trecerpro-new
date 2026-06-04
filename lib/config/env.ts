const FALLBACK_API_URL =
  "https://ungangrenous-endosporous-zainab.ngrok-free.dev";

export function getApiBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || FALLBACK_API_URL
  );
}
