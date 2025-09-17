import { supabase } from "../../utils/supabase";

// Authentication Functions (Supabase only)
const signUp = async (email, password, options = {}) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options.metadata || {},
      },
    });
    return { data, error };
  } catch (error) {
    console.error("Signup error:", error);
    return { data: null, error };
  }
};

const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  } catch (error) {
    console.error("Signin error:", error);
    return { data: null, error };
  }
};

const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    // Redirect to login page after successful signout
    if (!error && typeof window !== "undefined") {
      window.location.href = "/login";
    }

    return { error };
  } catch (error) {
    console.error("Signout error:", error);
    return { error };
  }
};

const getSession = async () => {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes("dummy")) {
      return { session: null, error: null };
    }

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    return { session, error };
  } catch (error) {
    console.error("Get session error:", error);
    return { session: null, error };
  }
};

const getUser = async () => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  } catch (error) {
    console.error("Get user error:", error);
    return { user: null, error };
  }
};

const resetPassword = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/password/reset-password-confirmation`,
    });
    return { data, error };
  } catch (error) {
    console.error("Reset password error:", error);
    return { data: null, error };
  }
};

const updatePassword = async (password) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });
    return { data, error };
  } catch (error) {
    console.error("Update password error:", error);
    return { data: null, error };
  }
};

// Helper function to check if user is authenticated
const isAuthenticated = async () => {
  const { session } = await getSession();
  return {
    isAuth: !!session?.access_token,
    method: "supabase",
    session,
  };
};

export const AuthActions = () => {
  return {
    // Authentication functions (Supabase only)
    signUp,
    signIn,
    signOut,
    getSession,
    getUser,
    resetPassword,
    updatePassword,
    isAuthenticated,
  };
};
