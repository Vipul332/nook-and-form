"use client";

import { useAuth } from "@clerk/nextjs";
import { useState } from "react";

export default function ClerkBackendTest() {
  const { isSignedIn, getToken } = useAuth();

  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testBackend = async () => {
    if (!isSignedIn) {
      setResult("Please sign in first.");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const token = await getToken();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clerk-test/protected`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Backend request failed"
        );
      }

      setResult(
        JSON.stringify(data, null, 2)
      );
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={testBackend}
        disabled={loading || !isSignedIn}
        className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
      >
        {loading
          ? "Testing..."
          : "Test Backend Authentication"}
      </button>

      {result && (
        <pre className="max-w-xl overflow-auto rounded-lg border p-4 text-left text-sm">
          {result}
        </pre>
      )}
    </div>
  );
}