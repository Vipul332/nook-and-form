"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  adminServiceApi,
  type Service,
} from "@/lib/api";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(
    null
  );

  useEffect(() => {
    let cancelled = false;

    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const result =
          await adminServiceApi.getServices();

        if (!result.success) {
          throw new Error(
            result.message ||
              "Failed to load services"
          );
        }

        if (!cancelled) {
          setServices(result.data?.items ?? []);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load services"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadServices();

    return () => {
      cancelled = true;
    };
  }, []);

  const handlePublishToggle = async (
    service: Service
  ) => {
    if (actionLoading !== null) {
      return;
    }

    const isPublished =
      service.status === "published";

    try {
      setActionLoading(service._id);
      setError("");
      setSuccess("");

      const result = isPublished
        ? await adminServiceApi.unpublishService(
            service._id
          )
        : await adminServiceApi.publishService(
            service._id
          );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to update service status"
        );
      }

      const updatedService = result.data;

      if (!updatedService) {
        throw new Error(
          "Updated service data was not returned"
        );
      }

      setServices((currentServices) =>
        currentServices.map((item) =>
          item._id === service._id
            ? updatedService
            : item
        )
      );

      const serviceName =
        updatedService.name?.trim() ||
        service.name?.trim() ||
        "Service";

      setSuccess(
        `${serviceName} ${
          isPublished
            ? "unpublished"
            : "published"
        } successfully.`
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update service status"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (
    service: Service
  ) => {
    if (actionLoading !== null) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(service._id);
      setError("");
      setSuccess("");

      const result =
        await adminServiceApi.deleteService(
          service._id
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to delete service"
        );
      }

      setServices((currentServices) =>
        currentServices.filter(
          (item) =>
            item._id !== service._id
        )
      );

      setSuccess(
        `"${service.name}" deleted successfully.`
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete service"
      );
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (
    price: number | string | null | undefined
  ): string => {
    if (
      price === undefined ||
      price === null ||
      price === ""
    ) {
      return "—";
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return "—";
    }

    return `₹${numericPrice.toLocaleString(
      "en-IN"
    )}`;
  };

  return (
    <main className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Services
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your interior design services.
          </p>
        </div>

        <Link
          href="/admin/services/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Add Service
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700"
        >
          {success}
        </div>
      )}

      {loading ? (
        <div className="rounded-lg border p-6 text-sm text-gray-500">
          Loading services...
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-lg border p-10 text-center">
          <p className="text-gray-500">
            No services found.
          </p>

          <Link
            href="/admin/services/new"
            className="mt-4 inline-block rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Create your first service
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-semibold">
                    Service
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Slug
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Starting Price
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Featured
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Status
                  </th>

                  <th className="px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {services.map((service) => {
                  const isActionLoading =
                    actionLoading ===
                    service._id;

                  const isPublished =
                    service.status ===
                    "published";

                  return (
                    <tr
                      key={service._id}
                      className="border-b last:border-b-0"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {service.image ? (
                            <Image
                              src={service.image}
                              alt={
                                service.name ||
                                "Service image"
                              }
                              width={64}
                              height={64}
                              className="h-16 w-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded-lg bg-gray-100" />
                          )}

                          <div className="min-w-0">
                            <div className="font-medium">
                              {service.name}
                            </div>

                            {service.shortDescription && (
                              <div className="mt-1 max-w-xs truncate text-xs text-gray-500">
                                {
                                  service.shortDescription
                                }
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {service.slug}
                      </td>

                      <td className="px-4 py-4">
                        {formatPrice(
                          service.startingPrice
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {service.featured ? (
                          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            No
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        {isPublished ? (
                          <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                            Published
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          <Link
                            href={`/admin/services/${service._id}/edit`}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            disabled={
                              actionLoading !==
                              null
                            }
                            onClick={() => {
                              void handlePublishToggle(
                                service
                              );
                            }}
                            className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isActionLoading
                              ? "Working..."
                              : isPublished
                                ? "Unpublish"
                                : "Publish"}
                          </button>

                          <button
                            type="button"
                            disabled={
                              actionLoading !==
                              null
                            }
                            onClick={() => {
                              void handleDelete(
                                service
                              );
                            }}
                            className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isActionLoading
                              ? "Working..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}