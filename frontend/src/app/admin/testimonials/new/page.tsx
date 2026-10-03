"use client";

import {
  FormEvent,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminTestimonialApi } from "@/lib/api";

export default function NewTestimonialPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState("5");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [published, setPublished] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    if (!selectedFile) {
      setImage(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      setImage(null);
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5 MB.");
      event.target.value = "";
      setImage(null);
      return;
    }

    setError("");
    setImage(selectedFile);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const parsedRating = Number(rating);

    if (
      !Number.isInteger(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Customer name must be at least 2 characters.");
      return;
    }

    if (message.trim().length < 5) {
      setError("Message must be at least 5 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();

      formData.append("name", name.trim());

      if (role.trim()) {
        formData.append("role", role.trim());
      }

      formData.append("rating", String(parsedRating));
      formData.append("message", message.trim());
      formData.append("published", String(published));

      if (image) {
        formData.append("image", image);
      }

      await adminTestimonialApi.createTestimonial(formData);

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create testimonial"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Link
          href="/admin/testimonials"
          className="text-sm text-gray-500 hover:text-black"
        >
          &larr; Back to Testimonials
        </Link>

        <h1 className="mt-3 text-2xl font-bold">
          Add Testimonial
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a customer review to your website.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border bg-white p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium"
          >
            Customer Name *
          </label>

          <input
            id="name"
            type="text"
            required
            minLength={2}
            maxLength={100}
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            placeholder="Enter customer name"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium"
          >
            Role or Designation
          </label>

          <input
            id="role"
            type="text"
            maxLength={100}
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            placeholder="e.g. Homeowner, Delhi"
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="rating"
            className="mb-1 block text-sm font-medium"
          >
            Rating *
          </label>

          <select
            id="rating"
            required
            value={rating}
            onChange={(event) =>
              setRating(event.target.value)
            }
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
          >
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium"
          >
            Testimonial Message *
          </label>

          <textarea
            id="message"
            required
            minLength={5}
            maxLength={1000}
            rows={6}
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            placeholder="Enter the customer's feedback"
            className="w-full resize-y rounded-md border px-3 py-2 text-sm outline-none focus:border-black"
          />

          <p className="mt-1 text-right text-xs text-gray-500">
            {message.length}/1000 characters
          </p>
        </div>

        <div>
          <label
            htmlFor="image"
            className="mb-1 block text-sm font-medium"
          >
            Customer Image
          </label>

          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="w-full rounded-md border px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-2 file:text-sm file:font-medium"
          />

          <p className="mt-1 text-xs text-gray-500">
            Optional. JPG, PNG, or WebP. Maximum size: 5 MB.
          </p>

          {image && (
            <div className="mt-2 flex items-center justify-between rounded-md bg-gray-50 p-3 text-sm">
              <span className="truncate">
                Selected: {image.name}
              </span>

              <button
                type="button"
                onClick={() => {
                  setImage(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="ml-3 shrink-0 text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <div className="rounded-md border p-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(event) =>
                setPublished(event.target.checked)
              }
              className="mt-1 h-4 w-4"
            />

            <span>
              <span className="block text-sm font-medium">
                Publish immediately
              </span>

              <span className="mt-1 block text-xs text-gray-500">
                If unchecked, the testimonial will be saved as a draft.
              </span>
            </span>
          </label>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
          <Link
            href="/admin/testimonials"
            className="rounded-md border px-4 py-2 text-center text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Testimonial"}
          </button>
        </div>
      </form>
    </main>
  );
}