/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  publicServiceApi,
  type Service,
} from "@/lib/api";

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function fetchServices() {
      try {
        const result = await publicServiceApi.getServices();

        if (cancelled) {
          return;
        }

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load services."
          );
        }

        setServices(result.data?.items ?? []);
        setError("");
      } catch (err: unknown) {
        if (!cancelled) {
          setServices([]);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load services."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchServices();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  return (
    <main className="min-h-screen bg-[#f6f4ef] text-[#20201e]">

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="border-b border-[#20201e]/10 px-6 pb-14 pt-12 sm:px-10 lg:px-16 lg:pb-16 lg:pt-16">
        <div className="mx-auto max-w-350">

          <div className="grid items-end gap-8 lg:grid-cols-[1fr_0.7fr]">

            {/* LEFT */}
            <div>
              <p className="mb-5 text-[9px] font-medium uppercase tracking-[0.32em] text-[#77736b]">
                Our Services
              </p>

              <h1 className="max-w-4xl font-serif text-[clamp(3rem,6vw,6.5rem)] font-normal leading-[0.88] tracking-[-0.055em]">
                Thoughtfully designed.
                <br />

                <span className="italic text-[#81796f]">
                  Beautifully delivered.
                </span>
              </h1>
            </div>

            {/* RIGHT */}
            <div className="max-w-md lg:pb-1 lg:pl-10">

              <div className="mb-5 h-px w-12 bg-[#20201e]/30" />

              <p className="text-sm leading-7 text-[#69665f]">
                From concept to completion, our services are
                tailored to create interiors that feel
                considered, personal and lasting.
              </p>

              <p className="mt-5 text-[9px] uppercase tracking-[0.28em] text-[#99948b]">
                Complete design experience
              </p>

            </div>

          </div>

        </div>
      </section>


      {/* =====================================================
          SERVICES SECTION
      ===================================================== */}
      <section className="px-6 py-14 sm:px-10 lg:px-16 lg:py-20">
        <div className="mx-auto max-w-350">

          {/* SECTION HEADER */}
          <div className="mb-8 flex items-end justify-between border-b border-[#20201e]/10 pb-5">

            <div>
              <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#77736b]">
                Explore What We Do
              </p>

              <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight sm:text-4xl">
                Services shaped around you
              </h2>
            </div>

            {!loading &&
              !error &&
              services.length > 0 && (
                <span className="hidden text-[9px] uppercase tracking-[0.22em] text-[#99948b] sm:block">
                  {services.length}{" "}
                  {services.length === 1
                    ? "Service"
                    : "Services"}
                </span>
              )}

          </div>


          {/* =================================================
              LOADING
          ================================================= */}
          {loading && (
            <div className="border border-[#20201e]/10 bg-[#ebe8e1] px-6 py-20 text-center">

              <p className="text-[9px] uppercase tracking-[0.3em] text-[#77736b]">
                Loading services
              </p>

            </div>
          )}


          {/* =================================================
              ERROR
          ================================================= */}
          {!loading && error && (
            <div className="border border-[#20201e]/10 bg-[#ebe8e1] px-6 py-20 text-center">

              <p className="mb-6 text-sm text-[#8a4038]">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="inline-flex items-center border border-[#20201e] bg-[#20201e] px-6 py-3 text-[9px] font-medium uppercase tracking-[0.22em] text-white transition hover:bg-transparent hover:text-[#20201e]"
              >
                Try Again
              </button>

            </div>
          )}


          {/* =================================================
              EMPTY STATE
          ================================================= */}
          {!loading &&
            !error &&
            services.length === 0 && (
              <div className="border border-[#20201e]/10 bg-[#ebe8e1] px-6 py-20 text-center">

                <p className="text-[9px] uppercase tracking-[0.3em] text-[#8a867e]">
                  Services
                </p>

                <h2 className="mt-4 font-serif text-3xl font-normal">
                  No services are currently available.
                </h2>

                <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#77736b]">
                  Our service collection is being prepared.
                  Please check back soon.
                </p>

              </div>
            )}


          {/* =================================================
              ALL SERVICE CARDS
          ================================================= */}
          {!loading &&
            !error &&
            services.length > 0 && (
              <div className="space-y-5">

                {services.map((service) => (
                  <article
                    key={service._id}
                    className="group overflow-hidden border border-[#20201e]/10 bg-[#ebe8e1] transition duration-500 hover:border-[#20201e]/25"
                  >

                    <div className="grid lg:grid-cols-[0.95fr_1.05fr]">

                      {/* =================================================
                          SERVICE IMAGE
                      ================================================= */}
                      <Link
                        href={`/services/${service.slug}`}
                        className="relative block h-70 overflow-hidden bg-[#dedad1] sm:h-90 lg:h-105"
                      >

                        {service.image ? (
                          <img
                            src={service.image}
                            alt={
                              service.name ||
                              "Interior design service"
                            }
                            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <span className="text-[9px] uppercase tracking-[0.25em] text-[#77736b]">
                              No image available
                            </span>
                          </div>
                        )}

                      </Link>


                      {/* =================================================
                          SERVICE INFORMATION
                      ================================================= */}
                      <div className="flex flex-col justify-between p-7 sm:p-9 lg:min-h-105 lg:p-10">

                        <div>

                          {/* SERVICE TITLE */}
                          <div className="flex items-start justify-between gap-6">

                            <div>

                              <p className="text-[9px] uppercase tracking-[0.28em] text-[#99948b]">
                                Interior Design Service
                              </p>

                              <h3 className="mt-4 max-w-xl font-serif text-3xl font-normal leading-none tracking-[-0.035em] sm:text-4xl lg:text-[3rem]">
                                {service.name}
                              </h3>

                            </div>


                            {/* ROUND ARROW */}
                            <Link
                              href={`/services/${service.slug}`}
                              aria-label={`Explore ${service.name}`}
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#20201e]/20 text-base transition duration-300 group-hover:translate-x-1 group-hover:border-[#20201e]"
                            >
                              →
                            </Link>

                          </div>


                          {/* DIVIDER */}
                          <div className="mt-6 h-px w-12 bg-[#20201e]/25" />


                          {/* DESCRIPTION */}
                          <p className="mt-6 max-w-xl text-sm leading-7 text-[#69665f]">
                            {service.shortDescription ||
                              service.description}
                          </p>


                          {/* =================================================
                              SERVICE META
                          ================================================= */}
                          <div className="mt-8 grid gap-6 border-t border-[#20201e]/10 pt-6 sm:grid-cols-2">

                            {/* PRICE */}
                            {service.startingPrice != null && (
                              <div>

                                <p className="text-[8px] uppercase tracking-[0.24em] text-[#99948b]">
                                  Starting from
                                </p>

                                <p className="mt-2 font-serif text-2xl font-normal">
                                  ₹
                                  {Number(
                                    service.startingPrice
                                  ).toLocaleString("en-IN")}
                                </p>

                              </div>
                            )}


                            {/* FEATURES */}
                            {service.features &&
                              service.features.length > 0 && (
                                <div>

                                  <p className="text-[8px] uppercase tracking-[0.24em] text-[#99948b]">
                                    Includes
                                  </p>

                                  <p className="mt-2 text-xs leading-6 text-[#69665f]">
                                    {service.features
                                      .slice(0, 2)
                                      .join(" · ")}
                                  </p>

                                </div>
                              )}

                          </div>

                        </div>


                        {/* =================================================
                            EXPLORE BUTTON
                        ================================================= */}
                        <div className="mt-8">

                          <Link
                            href={`/services/${service.slug}`}
                            className="inline-flex items-center gap-5 bg-[#20201e] px-6 py-3.5 text-[9px] font-medium uppercase tracking-[0.24em] text-white transition duration-300 hover:bg-[#343430]"
                          >
                            Explore Service

                            <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                              →
                            </span>
                          </Link>

                        </div>

                      </div>

                    </div>

                  </article>
                ))}

              </div>
            )}

        </div>
      </section>


      {/* =====================================================
          CLOSING SECTION
      ===================================================== */}
      {!loading &&
        !error &&
        services.length > 0 && (
          <section className="border-t border-[#20201e]/10 bg-[#20201e] px-6 py-20 text-white sm:px-10 lg:px-16 lg:py-24">

            <div className="mx-auto max-w-350">

              <div className="grid gap-10 lg:grid-cols-[1fr_0.7fr] lg:items-end">

                {/* LEFT */}
                <div>

                  <p className="mb-6 text-[9px] uppercase tracking-[0.3em] text-white/40">
                    Complete Design Experience
                  </p>

                  <h2 className="max-w-4xl font-serif text-[clamp(2.8rem,5vw,5.5rem)] font-normal leading-[0.9] tracking-tighter">
                    Good design begins
                    <br />
                    with{" "}
                    <span className="italic text-white/50">
                      understanding.
                    </span>
                  </h2>

                </div>


                {/* RIGHT */}
                <div className="lg:pl-8">

                  <p className="max-w-md text-sm leading-7 text-white/55">
                    Explore the service that fits your
                    project and take the next step with
                    our design team.
                  </p>

                  <Link
                    href="/contact"
                    className="mt-7 inline-flex items-center gap-5 border border-white/25 px-6 py-3.5 text-[9px] font-medium uppercase tracking-[0.24em] text-white transition hover:bg-white hover:text-[#20201e]"
                  >
                    Start a Conversation

                    <span>→</span>
                  </Link>

                </div>

              </div>

            </div>

          </section>
        )}

    </main>
  );
}