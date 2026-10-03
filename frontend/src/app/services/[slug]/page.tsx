"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  publicServiceApi,
  type Service,
} from "@/lib/api";

/* eslint-disable @next/next/no-img-element */

export default function ServiceDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function fetchService() {
      try {
        const result =
          await publicServiceApi.getServiceBySlug(slug);

        if (cancelled) {
          return;
        }

        if (!result.success || !result.data) {
          throw new Error(
            result.message || "Failed to load service."
          );
        }

        setService(result.data);
        setError("");
      } catch (err: unknown) {
        if (!cancelled) {
          setService(null);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load service."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      void fetchService();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f4ef] text-[#20201e]">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#77736b]">
              Service
            </p>

            <div className="mx-auto mt-5 h-px w-12 bg-[#20201e]/30" />

            <p className="mt-5 font-serif text-3xl">
              Loading...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !service) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f4ef] px-6 text-[#20201e]">
        <div className="max-w-xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a867e]">
            Service unavailable
          </p>

          <h1 className="mt-5 font-serif text-4xl font-normal sm:text-5xl">
            {error || "Service not found."}
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#77736b]">
            The service you are looking for could not be
            loaded.
          </p>

          <Link
            href="/services"
            className="mt-8 inline-flex items-center gap-3 border border-[#20201e] bg-[#20201e] px-7 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-transparent hover:text-[#20201e]"
          >
            <span>←</span>
            Back to Services
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#20201e]">
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#20201e]/10 bg-[#f6f4ef]/95 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-375 items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-[#20201e]/40 font-serif text-sm">
              I
            </span>

            <span className="hidden text-[9px] font-medium uppercase leading-[1.1] tracking-[0.22em] sm:block">
              Interior
              <br />
              Studio
            </span>
          </Link>

          {/* NAVIGATION */}

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/"
              className="text-[9px] uppercase tracking-[0.2em] text-[#69665f] transition hover:text-[#20201e]"
            >
              Home
            </Link>

            <Link
              href="/designs"
              className="text-[9px] uppercase tracking-[0.2em] text-[#69665f] transition hover:text-[#20201e]"
            >
              Designs
            </Link>

            <Link
              href="/services"
              className="text-[9px] uppercase tracking-[0.2em] text-[#20201e]"
            >
              Services
            </Link>

            <Link
              href="/#portfolio"
              className="text-[9px] uppercase tracking-[0.2em] text-[#69665f] transition hover:text-[#20201e]"
            >
              Portfolio
            </Link>

            <Link
              href="/#about"
              className="text-[9px] uppercase tracking-[0.2em] text-[#69665f] transition hover:text-[#20201e]"
            >
              About
            </Link>

            <Link
              href="/#contact"
              className="text-[9px] uppercase tracking-[0.2em] text-[#69665f] transition hover:text-[#20201e]"
            >
              Contact
            </Link>
          </nav>

          {/* APPOINTMENT */}

          <Link
            href="/consultation"
            className="inline-flex items-center border border-[#20201e]/30 px-4 py-2.5 text-[8px] font-medium uppercase tracking-[0.18em] transition hover:bg-[#20201e] hover:text-white sm:px-5"
          >
            Schedule Appointment
          </Link>
        </div>
      </header>

      {/* =====================================================
          MAIN SERVICE EXPERIENCE
      ====================================================== */}

      <section className="px-4 py-5 sm:px-6 sm:py-7 lg:px-10 lg:py-8">
        <div className="mx-auto max-w-375">
          {/* BACK */}

          <div className="mb-5 flex items-center justify-between">
            <Link
              href="/services"
              className="group inline-flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#77736b] transition hover:text-[#20201e]"
            >
              <span className="transition group-hover:-translate-x-1">
                ←
              </span>

              All Services
            </Link>

            <span className="hidden text-[9px] uppercase tracking-[0.25em] text-[#aaa59c] sm:block">
              Interior Design Studio
            </span>
          </div>

          {/* =================================================
              SERVICE CARD
          ================================================== */}

          <div className="grid overflow-hidden border border-[#20201e]/10 bg-white lg:grid-cols-[1.12fr_0.88fr]">
            {/* =================================================
                IMAGE
            ================================================== */}

            <div className="relative min-h-90 bg-[#e5e1d9] sm:min-h-125 lg:min-h-170">
              {service.image ? (
                <img
                  src={service.image}
                  alt={
                    service.name ||
                    "Interior design service"
                  }
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-90 items-center justify-center">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#77736b]">
                    No image available
                  </p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/30 to-transparent" />

              <div className="absolute left-5 top-5 border border-white/30 bg-black/20 px-4 py-2 backdrop-blur-md">
                <span className="text-[8px] uppercase tracking-[0.22em] text-white">
                  Interior Service
                </span>
              </div>

              {service.featured && (
                <div className="absolute right-5 top-5 bg-white/90 px-4 py-2 backdrop-blur-md">
                  <span className="text-[8px] uppercase tracking-[0.22em] text-[#20201e]">
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* =================================================
                SERVICE INFORMATION
            ================================================== */}

            <div className="flex flex-col justify-between bg-[#f6f4ef]">
              <div className="p-7 sm:p-10 lg:p-12">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#8a867e]">
                    Service
                  </span>

                  <span className="h-px w-8 bg-[#20201e]/25" />
                </div>

                <h1 className="mt-7 max-w-xl font-serif text-[clamp(2.7rem,4.5vw,5.2rem)] font-normal leading-[0.92] tracking-[-0.045em]">
                  {service.name}
                </h1>

                {service.shortDescription && (
                  <p className="mt-7 max-w-xl text-sm leading-7 text-[#69665f] sm:text-[15px]">
                    {service.shortDescription}
                  </p>
                )}

                <div className="my-8 h-px w-full bg-[#20201e]/10" />

                <div className="grid gap-7 sm:grid-cols-2">
                  {service.startingPrice != null && (
                    <div>
                      <p className="text-[8px] uppercase tracking-[0.25em] text-[#8a867e]">
                        Starting from
                      </p>

                      <p className="mt-3 font-serif text-3xl font-normal sm:text-4xl">
                        ₹
                        {Number(
                          service.startingPrice
                        ).toLocaleString("en-IN")}
                      </p>
                    </div>
                  )}

                  <div className="sm:border-l sm:border-[#20201e]/10 sm:pl-7">
                    <p className="text-[8px] uppercase tracking-[0.25em] text-[#8a867e]">
                      Service type
                    </p>

                    <p className="mt-3 text-sm text-[#4f4c46]">
                      Interior Design
                    </p>

                    <p className="mt-2 text-[9px] uppercase tracking-[0.16em] text-[#99948b]">
                      Tailored to your space
                    </p>
                  </div>
                </div>

                {service.description && (
                  <div className="mt-9 border-t border-[#20201e]/10 pt-7">
                    <p className="text-[8px] uppercase tracking-[0.25em] text-[#8a867e]">
                      About this service
                    </p>

                    <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#69665f]">
                      {service.description}
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  FEATURES
              ================================================== */}

              {service.features?.length > 0 && (
                <div className="border-t border-[#20201e]/10 bg-[#ebe8e1] px-7 py-7 sm:px-10 sm:py-9 lg:px-12">
                  <p className="text-[8px] uppercase tracking-[0.25em] text-[#8a867e]">
                    Includes
                  </p>

                  <div className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {service.features.map(
                      (feature, index) => (
                        <div
                          key={`${feature}-${index}`}
                          className="flex items-start gap-3"
                        >
                          <span className="mt-1 text-[10px] text-[#8a867e]">
                            ✓
                          </span>

                          <p className="text-xs leading-5 text-[#5f5b54]">
                            {feature}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              PREMIUM CTA
          ================================================== */}

          <section className="relative overflow-hidden border-x border-b border-[#20201e]/10 bg-[#20201e] px-7 py-12 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            {/* DECORATIVE LINE */}

            <div className="absolute left-0 top-0 h-px w-full bg-linear-to-r from-transparent via-white/25 to-transparent" />

            <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-16">
              {/* LEFT */}

              <div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-white/40">
                    Ready to begin?
                  </span>

                  <span className="h-px w-12 bg-white/20" />
                </div>

                <h2 className="mt-6 max-w-2xl font-serif text-[clamp(2.8rem,5vw,5rem)] font-normal leading-[0.92] tracking-[-0.045em]">
                  Let&apos;s create
                  <br />
                  your{" "}
                  <span className="italic text-white/55">
                    space.
                  </span>
                </h2>
              </div>

              {/* RIGHT */}

              <div className="lg:pb-1">
                <p className="max-w-md text-sm leading-7 text-white/55">
                  Tell us about your space, your ideas and
                  what you want it to feel like. We&apos;ll help
                  you take the next step.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <Link
                    href="/consultation"
                    className="group inline-flex items-center gap-5 bg-white px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-[#20201e] transition hover:bg-[#f0ede7]"
                  >
                    Schedule Appointment

                    <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </Link>

                  <Link
                    href="/services"
                    className="inline-flex items-center border border-white/20 px-6 py-4 text-[9px] font-medium uppercase tracking-[0.2em] text-white/75 transition hover:border-white/50 hover:text-white"
                  >
                    Explore Services
                  </Link>
                </div>
              </div>
            </div>

            {/* BOTTOM META */}

            <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                Interior Design Studio
              </p>

              <p className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                Designed around you
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}