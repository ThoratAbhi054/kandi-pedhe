"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Privacy Policy
        </h1>
        <p className="text-gray-700 mb-6">
          This is a placeholder Privacy Policy page. Replace this content with
          your actual policy.
        </p>
        <Link href="/" className="text-blue-600 hover:text-blue-500">
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
