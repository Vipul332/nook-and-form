"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  adminTestimonialApi,
  type Testimonial,
} from "@/lib/api";

export default function EditTestimonialPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const id = params.id;

  const [testimonial, setTestimonial] =
    useState<Testimonial | null>(null);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState("5");
  const [message, setMessage] = useState("");
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadTestimonial() {
      try {
        setLoading(true);
        setError("");

        const result =
          await adminTestimonialApi.getTestimonial(id);

        if (cancelled) {
          return;
        }

        if (!result.success || !result.data) {
          throw new Error(
            result.message ||
              "Testimonial not found"
          );
        }

        const testimonialData = result.data;

        setTestimonial(testimonialData);
        setName(testimonialData.name ?? "");
        setRole(testimonialData.role ?? "");
        setRating(
          String(testimonialData.rating ?? 5)
        );
        setMessage(testimonialData.message ?? "");
        setPublished(
          Boolean(testimonialData.published)
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load testimonial"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      void loadTestimonial();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      setImage(null);
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please select a JPG, PNG, or WebP image."
      );
      event.target.value = "";
      setImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Image size must be 5 MB or less."
      );
      event.target.value = "";
      setImage(null);
      return;
    }

    setError("");
    setImage(file);
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!name.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (!message.trim()) {
      setError(
        "Testimonial message is required."
      );
      return;
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      setError(
        "Rating must be between 1 and 5."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("role", role.trim());
      formData.append(
        "rating",
        String(numericRating)
      );
      formData.append(
        "message",
        message.trim()
      );
      formData.append(
        "published",
        String(published)
      );

      if (image) {
        formData.append("image", image);
      }

      const result =
        await adminTestimonialApi.updateTestimonial(
          id,
          formData
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to update testimonial"
        );
      }

      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update testimonial"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-sm text-gray-500">
          Loading testimonial...
        </p>
      </main>
    );
  }

  if (!testimonial) {
    return (
      <main className="p-6">
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error ||
            "Testimonial not found."}
        </div>

        <Link
          href="/admin/testimonials"
          className="text-sm underline"
        >
          Back to testimonials
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <Link
          href="/admin/testimonials"
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back to testimonials
        </Link>

        <h1 className="mt-3 text-2xl font-bold">
          Edit Testimonial
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Update the customer testimonial details.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium"
          >
            Customer name *
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            maxLength={100}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="role"
            className="mb-1 block text-sm font-medium"
          >
            Role / designation
          </label>

          <input
            id="role"
            type="text"
            value={role}
            onChange={(event) =>
              setRole(event.target.value)
            }
            maxLength={100}
            className="w-full rounded-md border px-3 py-2 text-sm"
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
            value={rating}
            onChange={(event) =>
              setRating(event.target.value)
            }
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="5">
              5 stars
            </option>
            <option value="4">
              4 stars
            </option>
            <option value="3">
              3 stars
            </option>
            <option value="2">
              2 stars
            </option>
            <option value="1">
              1 star
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="mb-1 block text-sm font-medium"
          >
            Testimonial message *
          </label>

          <textarea
            id="message"
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
            maxLength={1000}
            rows={6}
            required
            className="w-full rounded-md border px-3 py-2 text-sm"
          />

          <p className="mt-1 text-xs text-gray-500">
            {message.length}/1000 characters
          </p>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium">
            Current image
          </p>

          {testimonial.imageUrl ? (
            <Image
              src={testimonial.imageUrl}
              alt="Customer image"
              width={160}
              height={160}
              className="rounded-md object-cover"
            />
          ) : (
            <p className="text-sm text-gray-500">
              No image uploaded.
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="image"
            className="mb-1 block text-sm font-medium"
          >
            Replace image (optional)
          </label>

          <input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
            className="block w-full text-sm"
          />

          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG, or WebP. Maximum size: 5 MB.
            Leave empty to keep the current image.
          </p>

          {image && (
            <p className="mt-2 text-sm text-green-700">
              Selected: {image.name}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(event) =>
              setPublished(
                event.target.checked
              )
            }
            className="h-4 w-4"
          />

          <label
            htmlFor="published"
            className="text-sm font-medium"
          >
            Published
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

          <Link
            href="/admin/testimonials"
            className="rounded-md border px-5 py-2 text-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}