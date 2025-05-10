"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get("error");
    let errorMessage = "An error occurred during authentication";

    if (errorParam === "OAuthSignin") {
      errorMessage = "Error in the OAuth sign-in process";
    } else if (errorParam === "OAuthCallback") {
      errorMessage = "Error in the OAuth callback process";
    } else if (errorParam === "OAuthCreateAccount") {
      errorMessage = "Error creating the OAuth account";
    } else if (errorParam === "EmailCreateAccount") {
      errorMessage = "Error creating the email account";
    } else if (errorParam === "Callback") {
      errorMessage = "Error in the callback handler";
    } else if (errorParam === "OAuthAccountNotLinked") {
      errorMessage = "This email is already associated with another account";
    } else if (errorParam === "EmailSignin") {
      errorMessage = "Error sending the email sign-in link";
    } else if (errorParam === "CredentialsSignin") {
      errorMessage = "Invalid email or password";
    } else if (errorParam === "SessionRequired") {
      errorMessage = "You must be signed in to access this page";
    }

    setError(errorMessage);
  }, [searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-red-100"
          >
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </motion.div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {error}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Return to sign in
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Go to homepage
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}