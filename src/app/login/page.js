"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "../../utils/constant";
import Login from "../../components/login";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({ ...formData, [name]: value });
  // };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setMessage("");
  //   setError("");

  //   try {
  //     const res = await fetch(`${API_URL}/iam/login/`, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(formData),
  //     });

  //     const data = await res.json();

  //     if (res.ok) {
  //       document.cookie = `accessToken=${data.accessToken}; path=/; SameSite=Lax;`;
  //       setMessage("Login successful!");

  //       // Redirect to the home page
  //       router.push("/");
  //     } else {
  //       setError(data.message || "Invalid username or password");
  //     }
  //   } catch (err) {
  //     setError("Internal server error");
  //   }
  // };

  return (
    <>
      <Login />
    </>
  );
}
