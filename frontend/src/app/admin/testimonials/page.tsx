"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  adminTestimonialApi,
  type Testimonial,
} from "@/lib/api";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] =
    useState<Testimonial[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await adminTestimonialApi.getTestimonials();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load testimonials"
          );
        }

        if (!cancelled) {
          setTestimonials(
            result.data?.testimonials ?? []
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load testimonials"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchTestimonials();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePublishToggle = async (
    testimonial: Testimonial
  ) => {
    if (actionId !== null) {
      return;
    }

    try {
      setActionId(testimonial._id);
      setError("");

      const result = testimonial.published
        ? await adminTestimonialApi.unpublishTestimonial(
            testimonial._id
          )
        : await adminTestimonialApi.publishTestimonial(
            testimonial._id
          );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to update testimonial"
        );
      }

      if (!result.data) {
        throw new Error(
          "Updated testimonial data was not returned"
        );
      }

      const updatedTestimonial = result.data;

      setTestimonials((current) =>
        current.map((item) =>
          item._id === updatedTestimonial._id
            ? updatedTestimonial
            : item
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update testimonial"
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (
    testimonial: Testimonial
  ) => {
    if (actionId !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the testimonial from ${testimonial.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(testimonial._id);
      setError("");

      const result =
        await adminTestimonialApi.deleteTestimonial(
          testimonial._id
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to delete testimonial"
        );
      }

      setTestimonials((current) =>
        current.filter(
          (item) =>
            item._id !== testimonial._id
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete testimonial"
      );
    } finally {
      setActionId(null);
    }
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Testimonials
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage customer testimonials and
            publication status.
          </p>
        </div>

        <Link
          href="/admin/testimonials/new"
          className="inline-flex w-fit items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Add Testimonial
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border p-6 text-sm text-gray-500">
          Loading testimonials...
        </div>
      ) : testimonials.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="font-medium">
            No testimonials found.
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Add a testimonial to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full min-w-212.5 text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-3 font-medium">
                  Customer
                </th>

                <th className="px-4 py-3 font-medium">
                  Rating
                </th>

                <th className="px-4 py-3 font-medium">
                  Message
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>

                <th className="px-4 py-3 text-right font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {testimonials.map((testimonial) => {
                const isActionLoading =
                  actionId === testimonial._id;

                const rating = Math.max(
  0,
  Math.min(
    5,
    testimonial.rating ?? 0
  )
);

                return (
                  <tr
                    key={testimonial._id}
                    className="align-top"
                  >
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">
                        {testimonial.name}
                      </div>

                      {testimonial.role && (
                        <div className="mt-1 text-xs text-gray-500">
                          {testimonial.role}
                        </div>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <span
                        aria-label={`${rating} out of 5 stars`}
                      >
                        {"★".repeat(rating)}
                        {"☆".repeat(5 - rating)}
                      </span>

                      <span className="ml-2 text-gray-500">
                        {testimonial.rating}/5
                      </span>
                    </td>

                    <td className="max-w-md px-4 py-4">
                      <p className="whitespace-pre-wrap wrap-break-word text-gray-700">
                        {testimonial.message}
                      </p>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          testimonial.published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {testimonial.published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/testimonials/${testimonial._id}/edit`}
                          className="rounded border px-3 py-1.5 text-xs hover:bg-gray-50"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={
                            isActionLoading ||
                            actionId !== null
                          }
                          onClick={() =>
                            void handlePublishToggle(
                              testimonial
                            )
                          }
                          className="rounded border px-3 py-1.5 text-xs hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isActionLoading
                            ? "Please wait..."
                            : testimonial.published
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            isActionLoading ||
                            actionId !== null
                          }
                          onClick={() =>
                            void handleDelete(
                              testimonial
                            )
                          }
                          className="rounded border border-red-200 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}