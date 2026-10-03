
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  adminDesignApi,
  Design,
} from "@/lib/api";

export default function AdminDesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] =
    useState<string | null>(null);

  const loadDesigns = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await adminDesignApi.getDesigns();

      if (!response.data) {
        throw new Error("Design data not found");
      }

      setDesigns(response.data.items);
    } catch (err) {
      console.error(
        "Failed to load designs:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load designs"
      );

      setDesigns([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDesigns();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadDesigns]);

  const runAction = async (
    id: string,
    action:
      | "publish"
      | "unpublish"
      | "archive"
      | "unarchive"
  ) => {
    try {
      setActionId(id);
      setError("");

      let response;

      switch (action) {
        case "publish":
          response =
            await adminDesignApi.publishDesign(id);
          break;

        case "unpublish":
          response =
            await adminDesignApi.unpublishDesign(id);
          break;

        case "archive":
          response =
            await adminDesignApi.archiveDesign(id);
          break;

        case "unarchive":
          response =
            await adminDesignApi.unarchiveDesign(id);
          break;
      }

      if (!response.data) {
        throw new Error(
          "Updated design data not found"
        );
      }

      const updated: Design = response.data;

      setDesigns((current) =>
        current.map((design) =>
          design._id === id
            ? updated
            : design
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Action failed"
      );
    } finally {
      setActionId(null);
    }
  };

  const deleteDesign = async (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this design?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(id);
      setError("");

      await adminDesignApi.deleteDesign(id);

      setDesigns((current) =>
        current.filter(
          (design) => design._id !== id
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete design"
      );
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border bg-white p-10 text-center">
            <p className="text-gray-500">
              Loading designs...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Design Catalog
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your interior design portfolio.
            </p>
          </div>

          <Link
            href="/admin/designs/new"
            className="rounded-lg bg-yellow-600 px-5 py-3 text-center text-white transition hover:bg-gray-800"
          >
            + Create Design
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700"
          >
            {error}
          </div>
        )}

        {/* Empty State */}
        {designs.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-gray-900">
              No designs found
            </h2>

            <p className="mt-2 text-gray-600">
              Create your first interior design.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link
                href="/admin/designs/new"
                className="rounded-lg bg-yellow-600 px-5 py-3 text-white hover:bg-yellow-700"
              >
                Create Design
              </Link>

              <button
                type="button"
                onClick={() =>
                  void loadDesigns()
                }
                className="rounded-lg border px-5 py-3 hover:bg-gray-50"
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                      Design
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                      Room
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                      Style
                    </th>

                    <th className="px-5 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {designs.map((design) => (
                    <tr
                      key={design._id}
                      className="hover:bg-gray-50"
                    >
                      {/* Design */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          {design.images?.[0]?.url ? (
                            <Image
                              src={
                                design.images[0].url
                              }
                              alt={
                                design.images[0].alt ||
                                design.title
                              }
                              width={80}
                              height={64}
                              className="h-16 w-20 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-16 w-20 items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-500">
                              No image
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900">
                              {design.title}
                            </p>

                            <p className="text-sm text-gray-500">
                              {design.images?.length || 0}{" "}
                              images
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Room */}
                      <td className="px-5 py-4 capitalize text-gray-700">
                        {design.roomType
                          ?.replace(/-/g, " ") ||
                          "—"}
                      </td>

                      {/* Style */}
                      <td className="px-5 py-4 capitalize text-gray-700">
                        {design.style || "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {design.isArchived ? (
                          <span className="rounded-full bg-gray-200 px-3 py-1 text-xs font-medium text-gray-700">
                            Archived
                          </span>
                        ) : design.published ? (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                            Draft
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap justify-end gap-2">

                          {/* Publish */}
                          {!design.isArchived &&
                            !design.published && (
                              <button
                                type="button"
                                onClick={() =>
                                  void runAction(
                                    design._id,
                                    "publish"
                                  )
                                }
                                disabled={
                                  actionId ===
                                  design._id
                                }
                                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {actionId ===
                                design._id
                                  ? "..."
                                  : "Publish"}
                              </button>
                            )}

                          {/* Unpublish */}
                          {!design.isArchived &&
                            design.published && (
                              <button
                                type="button"
                                onClick={() =>
                                  void runAction(
                                    design._id,
                                    "unpublish"
                                  )
                                }
                                disabled={
                                  actionId ===
                                  design._id
                                }
                                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {actionId ===
                                design._id
                                  ? "..."
                                  : "Unpublish"}
                              </button>
                            )}

                          {/* Archive / Unarchive */}
                          {design.isArchived ? (
                            <button
                              type="button"
                              onClick={() =>
                                void runAction(
                                  design._id,
                                  "unarchive"
                                )
                              }
                              disabled={
                                actionId ===
                                design._id
                              }
                              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {actionId ===
                              design._id
                                ? "..."
                                : "Unarchive"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                void runAction(
                                  design._id,
                                  "archive"
                                )
                              }
                              disabled={
                                actionId ===
                                design._id
                              }
                              className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {actionId ===
                              design._id
                                ? "..."
                                : "Archive"}
                            </button>
                          )}

                          {/* Edit */}
                          <Link
                            href={`/admin/designs/${design._id}/edit`}
                            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            Edit
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              void deleteDesign(
                                design._id
                              )
                            }
                            disabled={
                              actionId ===
                              design._id
                            }
                            className="rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {actionId ===
                            design._id
                              ? "..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
