import wretch from "wretch";
import { API_URL } from "../../utils/constant";

// Create a simple fetcher that works with Supabase session-based auth
// Note: This fetcher assumes the caller will handle authentication headers
const api = (accessToken) => {
  const baseApi = wretch(API_URL);

  if (accessToken) {
    return baseApi.auth(`Bearer ${accessToken}`);
  }

  return baseApi;
};

export const fetcher = (url, accessToken) => {
  return api(accessToken).get(url).json();
};
