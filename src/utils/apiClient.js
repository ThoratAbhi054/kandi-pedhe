import wretch from "wretch";
import { API_URL } from "./constant";
import { AuthActions } from "../app/auth/utils";

const getAuthActions = () => {
  // Dynamically import AuthActions to avoid circular dependencies
  // and ensure it's available in client-side context
  if (typeof window !== "undefined") {
    return AuthActions();
  }
  return { getToken: () => null, logoutAndRedirect: () => {} };
};

const apiClient = wretch(API_URL)
  .content("application/json")
  .accept("application/json")
  .auth((request) => {
    const { getToken } = getAuthActions();
    const accessToken = getToken("access");
    return accessToken ? `Bearer ${accessToken}` : "";
  })
  .catcher(401, (error) => {
    console.error("API Error 401: Unauthorized", error);
    const { logoutAndRedirect } = getAuthActions();
    logoutAndRedirect();
    // Re-throw to propagate the error to the component level if needed
    throw error;
  })
  .catcher(403, (error) => {
    console.error("API Error 403: Forbidden", error);
    // Handle forbidden errors, maybe show a specific message
    throw error;
  })
  .catcher(500, (error) => {
    console.error("API Error 500: Server Error", error);
    // Handle server errors
    throw error;
  })
  .json(); // Automatically parse JSON responses

export default apiClient;
