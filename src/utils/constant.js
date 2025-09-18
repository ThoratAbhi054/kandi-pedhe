export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
export const RAZORPAY_KEY_SECRET = process.env.NEXT_PUBLIC_RAZORPAY_KEY_SECRET;

// Supabase configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Utility function to handle image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // If the path already starts with http:// or https://, return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If it's a relative path, prepend the API URL
  return `${API_URL}${imagePath}`;
};
