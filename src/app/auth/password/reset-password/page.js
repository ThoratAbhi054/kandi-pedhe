"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "../../utils";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { resetPassword } = AuthActions();

  const onSubmit = async (data) => {
    try {
      await resetPassword(data.email).res();
      alert("Password reset email sent. Please check your inbox.");
    } catch (err) {
      alert("Failed to send password reset email. Please try again.");
    }
  };
};

export default ResetPassword;
