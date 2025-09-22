"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-700 mb-6">
          This is a placeholder Terms of Service page. Replace this content with
          your actual terms.
        </p>
        <Link href="/" className="text-blue-600 hover:text-blue-500">
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
