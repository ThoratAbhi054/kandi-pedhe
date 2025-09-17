"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const SupabaseContext = createContext({});

export const useSupabase = () => {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error("useSupabase must be used within a SupabaseProvider");
  }
  return context;
};

export const SupabaseProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if Supabase is properly configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes("dummy")) {
      console.warn("Supabase not configured, skipping auth initialization");
      setLoading(false);
      return;
    }

    // Get initial session
    const getSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("Error getting session:", error);
        } else {
          setSession(session);
          setUser(session?.user || null);
        }
      } catch (error) {
        console.error("Failed to get session:", error);
      }
      setLoading(false);
    };

    getSession();

    // Listen for auth changes
    let subscription;
    try {
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Supabase auth event:", event, session?.user?.email);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      });
      subscription = authSubscription;
    } catch (error) {
      console.error("Failed to set up auth listener:", error);
      setLoading(false);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    supabase,
    signUp: async (email, password, options = {}) => {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options,
        });
        return { data, error };
      } catch (error) {
        console.error("SignUp error:", error);
        return { data: null, error };
      }
    },
    signIn: async (email, password) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        return { data, error };
      } catch (error) {
        console.error("SignIn error:", error);
        return { data: null, error };
      }
    },
    signOut: async () => {
      try {
        const { error } = await supabase.auth.signOut();
        return { error };
      } catch (error) {
        console.error("SignOut error:", error);
        return { error };
      }
    },
    resetPassword: async (email) => {
      try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/auth/password/reset-password-confirmation`,
          }
        );
        return { data, error };
      } catch (error) {
        console.error("ResetPassword error:", error);
        return { data: null, error };
      }
    },
    updatePassword: async (password) => {
      try {
        const { data, error } = await supabase.auth.updateUser({
          password,
        });
        return { data, error };
      } catch (error) {
        console.error("UpdatePassword error:", error);
        return { data: null, error };
      }
    },
    signInWithGoogle: async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });
        return { data, error };
      } catch (error) {
        console.error("Google SignIn error:", error);
        return { data: null, error };
      }
    },
    signUpWithGoogle: async () => {
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/`,
          },
        });
        return { data, error };
      } catch (error) {
        console.error("Google SignUp error:", error);
        return { data: null, error };
      }
    },
  };

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  );
};
