"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  adminConsultationApi,
  adminDesignApi,
  adminProjectApi,
  adminServiceApi,
  adminTestimonialApi,
  type AdminConsultation,
} from "@/lib/api";

const managementCards = [
  {
    title: "Designs",
    description:
      "Manage your interior design catalog.",
    href: "/admin/designs",
  },
  {
    title: "Projects",
    description:
      "Manage completed and ongoing projects.",
    href: "/admin/projects",
  },
  {
    title: "Services",
    description:
      "Manage services offered by the business.",
    href: "/admin/services",
  },
  {
    title: "Testimonials",
    description:
      "Manage customer testimonials.",
    href: "/admin/testimonials",
  },
];

interface DashboardCounts {
  designs: number;
  projects: number;
  services: number;
  testimonials: number;
  newConsultations: number;
  inProgressConsultations: number;
  completedConsultations: number;
}

const initialCounts: DashboardCounts = {
  designs: 0,
  projects: 0,
  services: 0,
  testimonials: 0,
  newConsultations: 0,
  inProgressConsultations: 0,
  completedConsultations: 0,
};

const formatConsultationStatus = (
  status: AdminConsultation["status"]
): string => {
  switch (status) {
    case "NEW":
      return "New";

    case "CONTACTED":
      return "Contacted";

    case "SCHEDULED":
      return "Scheduled";

    case "COMPLETED":
      return "Completed";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
};

const formatConsultationType = (
  type: AdminConsultation["consultationType"]
): string => {
  switch (type) {
    case "PHONE":
      return "Phone";

    case "WHATSAPP":
      return "WhatsApp";

    case "ONLINE":
      return "Online";

    case "OFFICE_VISIT":
      return "Office Visit";

    case "SITE_VISIT":
      return "Site Visit";

    default:
      return type;
  }
};

const formatDate = (
  date?: string
): string => {
  if (!date) {
    return "Date not provided";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date not available";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const getStatusClasses = (
  status: AdminConsultation["status"]
): string => {
  switch (status) {
    case "NEW":
      return "bg-amber-100 text-amber-800";

    case "CONTACTED":
      return "bg-blue-100 text-blue-800";

    case "SCHEDULED":
      return "bg-emerald-100 text-emerald-800";

    case "COMPLETED":
      return "bg-gray-100 text-gray-700";

    case "CANCELLED":
      return "bg-red-100 text-red-800";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function AdminDashboardPage() {
  const [counts, setCounts] =
    useState<DashboardCounts>(
      initialCounts
    );

  const [
    activeConsultations,
    setActiveConsultations,
  ] = useState<AdminConsultation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    updatingConsultationId,
    setUpdatingConsultationId,
  ] = useState<string | null>(null);

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const [
          designsResult,
          projectsResult,
          servicesResult,
          testimonialsResult,
          newResult,
          contactedResult,
          scheduledResult,
          completedResult,
        ] = await Promise.all([
          adminDesignApi.getDesigns(),
          adminProjectApi.getProjects(),
          adminServiceApi.getServices(),
          adminTestimonialApi.getTestimonials(),

          adminConsultationApi.getConsultations(
            {
              status: "NEW",
              limit: 8,
            }
          ),

          adminConsultationApi.getConsultations(
            {
              status: "CONTACTED",
              limit: 8,
            }
          ),

          adminConsultationApi.getConsultations(
            {
              status: "SCHEDULED",
              limit: 8,
            }
          ),

          adminConsultationApi.getConsultations(
            {
              status: "COMPLETED",
              limit: 1,
            }
          ),
        ]);

        if (
          !designsResult.data ||
          !projectsResult.data ||
          !servicesResult.data ||
          !testimonialsResult.data ||
          !newResult.data ||
          !contactedResult.data ||
          !scheduledResult.data ||
          !completedResult.data
        ) {
          throw new Error(
            "Dashboard data could not be loaded."
          );
        }

        const newConsultations =
          newResult.data;

        const contactedConsultations =
          contactedResult.data;

        const scheduledConsultations =
          scheduledResult.data;

        const completedConsultations =
          completedResult.data;

        const active = [
          ...newConsultations.consultations,
          ...contactedConsultations.consultations,
          ...scheduledConsultations.consultations,
        ]
          .sort(
            (a, b) =>
              new Date(
                b.createdAt
              ).getTime() -
              new Date(
                a.createdAt
              ).getTime()
          )
          .slice(0, 8);

        const serviceData =
          servicesResult.data;

        const serviceTotal =
          Array.isArray(serviceData)
            ? serviceData.length
            : serviceData.total;

        const projectTotal =
          projectsResult.data.total ??
          projectsResult.data.items.length;

        setCounts({
          designs:
            designsResult.data.pagination
              ?.total ??
            designsResult.data.items.length,

          projects:
            projectTotal,

          services:
            serviceTotal,

          testimonials:
  testimonialsResult.data
    .pagination.total ??
  testimonialsResult.data
    .testimonials.length,

          newConsultations:
            newConsultations
              .pagination.total,

          inProgressConsultations:
            contactedConsultations
              .pagination.total +
            scheduledConsultations
              .pagination.total,

          completedConsultations:
            completedConsultations
              .pagination.total,
        });

        setActiveConsultations(
          active
        );
      } catch (dashboardError) {
        console.error(
          "Failed to load dashboard:",
          dashboardError
        );

        setError(
          dashboardError instanceof Error
            ? dashboardError.message
            : "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    const timer =
      window.setTimeout(() => {
        void loadDashboard();
      }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadDashboard]);

  const handleCompleteConsultation =
    async (
      consultationId: string
    ) => {
      try {
        setUpdatingConsultationId(
          consultationId
        );

        setError("");

        await adminConsultationApi.updateConsultation(
          consultationId,
          {
            status: "COMPLETED",
          }
        );

        await loadDashboard();
      } catch (completionError) {
        setError(
          completionError instanceof Error
            ? completionError.message
            : "Failed to complete consultation."
        );
      } finally {
        setUpdatingConsultationId(
          null
        );
      }
    };

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Loading your admin dashboard...
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-gray-200 bg-white"
              />
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      {/* Page Heading */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Manage your interior design
          platform from one place.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Overview */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Current content across your
            platform.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {managementCards.map(
            (card) => {
              const count =
                card.title ===
                "Designs"
                  ? counts.designs
                  : card.title ===
                      "Projects"
                    ? counts.projects
                    : card.title ===
                        "Services"
                      ? counts.services
                      : counts.testimonials;

              return (
                <div
                  key={card.href}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {count}
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    {card.description}
                  </p>

                  <Link
                    href={card.href}
                    className="mt-4 inline-flex text-sm font-semibold text-gray-900 hover:underline"
                  >
                    Manage{" "}
                    {card.title} →
                  </Link>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Consultations */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Consultations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Only active consultations
            require attention. Completed
            consultations remain stored as
            history.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-sm font-medium text-amber-800">
              New
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-950">
              {counts.newConsultations}
            </p>

            <p className="mt-2 text-sm text-amber-700">
              Awaiting admin action
            </p>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <p className="text-sm font-medium text-blue-800">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-950">
              {counts.inProgressConsultations}
            </p>

            <p className="mt-2 text-sm text-blue-700">
              Contacted or scheduled
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-medium text-gray-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {counts.completedConsultations}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Preserved in consultation
              history
            </p>
          </div>
        </div>
      </section>

      {/* Active Consultations */}
      <section className="mt-10">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Active Consultations
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            The latest consultations that
            still need attention.
          </p>
        </div>

        {activeConsultations.length ===
        0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-base font-medium text-gray-900">
              No active consultations
            </p>

            <p className="mt-2 text-sm text-gray-500">
              New consultation requests
              will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeConsultations.map(
              (consultation) => (
                <div
                  key={consultation._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-semibold text-gray-900">
                          {
                            consultation.name
                          }
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            consultation.status
                          )}`}
                        >
                          {formatConsultationStatus(
                            consultation.status
                          )}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 sm:grid-cols-2">
                        <p>
                          <span className="font-medium text-gray-900">
                            Phone:
                          </span>{" "}
                          {consultation.phone ||
                            "Not provided"}
                        </p>

                        <p>
                          <span className="font-medium text-gray-900">
                            Email:
                          </span>{" "}
                          {
                            consultation.email
                          }
                        </p>

                        <p>
                          <span className="font-medium text-gray-900">
                            Type:
                          </span>{" "}
                          {formatConsultationType(
                            consultation.consultationType
                          )}
                        </p>

                        <p>
                          <span className="font-medium text-gray-900">
                            Submitted:
                          </span>{" "}
                          {formatDate(
                            consultation.createdAt
                          )}
                        </p>

                        {consultation.location && (
                          <p>
                            <span className="font-medium text-gray-900">
                              Location:
                            </span>{" "}
                            {
                              consultation.location
                            }
                          </p>
                        )}

                        {consultation.preferredDate && (
                          <p>
                            <span className="font-medium text-gray-900">
                              Preferred Date:
                            </span>{" "}
                            {formatDate(
                              consultation.preferredDate
                            )}
                          </p>
                        )}
                      </div>

                      {consultation.message && (
                        <p className="mt-3 rounded-lg bg-gray-50 p-3 text-sm leading-6 text-gray-600">
                          {
                            consultation.message
                          }
                        </p>
                      )}
                    </div>

                    <div className="shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          void handleCompleteConsultation(
                            consultation._id
                          )
                        }
                        disabled={
                          updatingConsultationId ===
                          consultation._id
                        }
                        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 lg:w-auto"
                      >
                        {updatingConsultationId ===
                        consultation._id
                          ? "Completing..."
                          : "Mark Completed"}
                      </button>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}