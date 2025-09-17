import wretch from "wretch";
import { API_URL } from "./constant";
import { supabase } from "./supabase";

// Get Supabase auth header
const getAuthHeader = async () => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      return `Bearer ${session.access_token}`;
    }
  } catch (error) {
    console.warn("Failed to get Supabase session:", error);
  }

  return "";
};

// Create API client with error handling
const createApiClient = () => {
  return wretch(API_URL)
    .content("application/json")
    .accept("application/json")
    .catcher(401, async (error) => {
      console.error("API Error 401: Unauthorized", error);
      // Sign out from Supabase and redirect
      try {
        await supabase.auth.signOut();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
      } catch (signOutError) {
        console.error("Error signing out:", signOutError);
      }
      throw error;
    })
    .catcher(403, (error) => {
      console.error("API Error 403: Forbidden", error);
      throw error;
    })
    .catcher(500, (error) => {
      console.error("API Error 500: Server Error", error);
      throw error;
    })
    .json();
};

// API client with Supabase authentication
const apiClient = {
  async get(url, options = {}) {
    const authHeader = await getAuthHeader();
    return createApiClient()
      .headers({ Authorization: authHeader, ...options.headers })
      .get(url);
  },

  async post(data, url, options = {}) {
    const authHeader = await getAuthHeader();
    return createApiClient()
      .headers({ Authorization: authHeader, ...options.headers })
      .post(data, url);
  },

  async put(data, url, options = {}) {
    const authHeader = await getAuthHeader();
    return createApiClient()
      .headers({ Authorization: authHeader, ...options.headers })
      .put(data, url);
  },

  async patch(data, url, options = {}) {
    const authHeader = await getAuthHeader();
    return createApiClient()
      .headers({ Authorization: authHeader, ...options.headers })
      .patch(data, url);
  },

  async delete(url, options = {}) {
    const authHeader = await getAuthHeader();
    return createApiClient()
      .headers({ Authorization: authHeader, ...options.headers })
      .delete(url);
  },
};

export default apiClient;
