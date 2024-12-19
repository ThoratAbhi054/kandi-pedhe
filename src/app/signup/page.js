"use client";

import { useState } from "react";
import { API_URL } from "../../utils/constant";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const router = useRouter(); // Initialize router

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (event) => {
    event.preventDefault(); // Prevent form submission
    setError(null);
    setSuccessMessage("");

    try {
      const response = await fetch(`${API_URL}/iam/signup/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData?.detail || "Signup failed. Please try again."
        );
      }

      const data = await response.json();

      Cookies.set("accessToken", data.accessToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: 1,
      });

      Cookies.set("refreshToken", data.refreshToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        expires: 7,
      });

      setSuccessMessage("Signup successful! Redirecting...");
      router.push("/"); // Redirect to the root page
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
        <img alt="" src="/images/IngaleLogo.png" className="h-24 w-36" />
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Signup
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-900"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-900"
            >
              First Name
            </label>
            <input
              id="first_name"
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-900"
            >
              Last Name
            </label>
            <input
              id="last_name"
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Sign up
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {successMessage && (
          <p className="mt-4 text-sm text-green-600">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
