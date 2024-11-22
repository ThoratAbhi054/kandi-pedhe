"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../utils/constant";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await fetch(`${API_URL}/iam/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      console.log("Access Token ===>", data.accessToken);

      if (res.ok) {
        document.cookie = `accessToken=${data.accessToken}; path=/; secure; SameSite=Strict;`;
        console.log("Cookie set: ", document.cookie);

        setMessage("Login successful!");

        // Redirect to the home page
        router.push("/");
      } else {
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("Internal server error");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="block w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>
      </form>
      <p className="text-center mt-4">
        Don’t have an account?{" "}
        <a href="/signup" className="text-blue-500 hover:underline">
          Signup here
        </a>
      </p>
    </div>
  );
}
