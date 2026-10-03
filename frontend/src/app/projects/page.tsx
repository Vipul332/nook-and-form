"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  publicProjectApi,
  type Project,
} from "@/lib/api";

const PROJECT_BACKGROUNDS = [
  "#FFF7E8",
  "#F3E7D0",
  "#F8F0E2",
  "#EEE4D2",
];

const SERIF_FONT =
  "Georgia, 'Times New Roman', serif";

const SANS_FONT =
  "Arial, Helvetica, sans-serif";

function getImageUrl(image: unknown): string {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    return image;
  }

  if (
    typeof image === "object" &&
    image !== null &&
    "url" in image
  ) {
    const url = (image as { url?: unknown }).url;

    return typeof url === "string" ? url : "";
  }

  return "";
}

function getImageAlt(
  image: unknown,
  fallback: string
): string {
  if (
    typeof image === "object" &&
    image !== null &&
    "alt" in image
  ) {
    const alt = (image as { alt?: unknown }).alt;

    if (typeof alt === "string" && alt.trim()) {
      return alt;
    }
  }

  return fallback;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousRootBackground =
      root.style.backgroundColor;

    const previousBodyBackground =
      body.style.backgroundColor;

    const previousRootOverflowX =
      root.style.overflowX;

    const previousBodyOverflowX =
      body.style.overflowX;

    const previousRootOverflowY =
      root.style.overflowY;

    const previousBodyOverflowY =
      body.style.overflowY;

    const previousRootOverscroll =
      root.style.overscrollBehavior;

    const previousBodyOverscroll =
      body.style.overscrollBehavior;

    const previousRootTouchAction =
      root.style.touchAction;

    const previousBodyTouchAction =
      body.style.touchAction;

    const previousRootHeight =
      root.style.height;

    const previousBodyMinHeight =
      body.style.minHeight;

    const previousBodyOverflow =
      body.style.overflow;

    root.style.backgroundColor = "#FFF7E8";
    body.style.backgroundColor = "#FFF7E8";

    root.style.setProperty(
      "overflow-x",
      "hidden",
      "important"
    );

    root.style.setProperty(
      "overflow-y",
      "scroll",
      "important"
    );

    root.style.setProperty(
      "overscroll-behavior-y",
      "none",
      "important"
    );

    root.style.setProperty(
      "touch-action",
      "auto",
      "important"
    );

    body.style.setProperty(
      "overflow-x",
      "hidden",
      "important"
    );

    body.style.setProperty(
      "overflow-y",
      "visible",
      "important"
    );

    body.style.setProperty(
      "overscroll-behavior-y",
      "none",
      "important"
    );

    body.style.setProperty(
      "touch-action",
      "auto",
      "important"
    );

    root.style.height = "auto";
    body.style.minHeight = "100%";
    body.style.overflow = "visible";

    return () => {
      root.style.backgroundColor =
        previousRootBackground;

      body.style.backgroundColor =
        previousBodyBackground;

      root.style.overflowX =
        previousRootOverflowX;

      body.style.overflowX =
        previousBodyOverflowX;

      root.style.overflowY =
        previousRootOverflowY;

      body.style.overflowY =
        previousBodyOverflowY;

      root.style.overscrollBehavior =
        previousRootOverscroll;

      body.style.overscrollBehavior =
        previousBodyOverscroll;

      root.style.touchAction =
        previousRootTouchAction;

      body.style.touchAction =
        previousBodyTouchAction;

      root.style.height =
        previousRootHeight;

      body.style.minHeight =
        previousBodyMinHeight;

      body.style.overflow =
        previousBodyOverflow;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchProjects() {
      try {
        setLoading(true);

        const result =
          await publicProjectApi.getProjects();

        if (!cancelled) {
          if (!result.success) {
            throw new Error(
              result.message ||
                "Failed to load projects."
            );
          }

          setProjects(
            result.data?.items ?? []
          );

          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setProjects([]);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load projects."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void fetchProjects();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setError("");
    setLoading(true);
    setRetryCount(
      (count) => count + 1
    );
  };

  const heroImage = getImageUrl(
    projects[0]?.afterImage ??
      projects[0]?.images?.[0]
  );

  return (
    <main
      className="min-h-screen bg-[#FFF7E8] text-[#0B1F3A]"
      style={{
        fontFamily: SANS_FONT,
      }}
    >
      {/* HERO */}

      <section className="relative overflow-hidden bg-[#F3E7D0] px-5 pb-16 pt-24 sm:px-8 sm:pb-20 sm:pt-28 lg:px-12 lg:pb-24 lg:pt-32">
        {heroImage && (
          <Image
            src={heroImage}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
          />
        )}

        <div className="absolute inset-0 bg-[#F3E7D0]/75" />

        <div className="absolute inset-0 bg-linear-to-r from-[#F3E7D0]/90 via-[#F3E7D0]/65 to-[#FFF7E8]/30" />

        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-[#274C77]/10" />

        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full border border-[#274C77]/10" />

        <div className="relative mx-auto max-w-375">
          <p className="mb-6 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#274C77]">
            Selected Projects
          </p>

          <h1
            className="max-w-5xl text-[clamp(3.4rem,8vw,7rem)] font-normal leading-[0.82] tracking-tight text-[#0B1F3A]"
            style={{
              fontFamily: SERIF_FONT,
            }}
          >
            Spaces transformed
            <br />
            <span className="text-[#6F8799]">
              with intention.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-sm leading-7 text-[#4F5965] sm:text-[14px]">
            Explore the spaces we have transformed —
            from their original character to thoughtful,
            finished interiors designed around the people
            who live in them.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-12 bg-[#274C77]/40" />

            <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#6F747C]">
              Before · After · Transformation
            </span>
          </div>
        </div>
      </section>

      {/* LOADING */}

      {loading && (
        <section className="bg-[#FFF7E8] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-375 space-y-20">
            <ProjectSkeleton />
            <ProjectSkeleton />
            <ProjectSkeleton />
          </div>
        </section>
      )}

      {/* ERROR */}

      {!loading && error && (
        <section className="bg-[#F3E7D0] px-5 py-20 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-375">
            <div className="px-6 py-16 text-center">
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#274C77]">
                Something went wrong
              </p>

              <h2
                className="mt-5 text-4xl font-normal leading-tight text-[#0B1F3A] sm:text-5xl"
                style={{
                  fontFamily: SERIF_FONT,
                }}
              >
                We couldn&apos;t load
                <br />
                the projects.
              </h2>

              <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#5B6573]">
                {error}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-8 rounded-full bg-[#274C77] px-7 py-3.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] transition duration-300 hover:bg-[#0B1F3A]"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      )}

      {/* EMPTY STATE */}

      {!loading &&
        !error &&
        projects.length === 0 && (
          <section className="bg-[#F3E7D0] px-5 py-24 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-375">
              <div className="px-6 text-center">
                <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#274C77]">
                  Our Portfolio
                </p>

                <h2
                  className="mt-5 text-4xl font-normal text-[#0B1F3A] sm:text-5xl"
                  style={{
                    fontFamily: SERIF_FONT,
                  }}
                >
                  Projects are
                  <br />
                  coming soon.
                </h2>

                <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#5B6573]">
                  Completed projects will appear here
                  once they are added by the studio.
                </p>
              </div>
            </div>
          </section>
        )}

      {/* PROJECTS */}

      {!loading &&
        !error &&
        projects.length > 0 && (
          <>
            <section className="bg-[#FFF7E8]">
              <div className="mx-auto max-w-375">
                {projects.map(
                  (project, index) => (
                    <div
                      key={project._id}
                      style={{
                        backgroundColor:
                          PROJECT_BACKGROUNDS[
                            index %
                              PROJECT_BACKGROUNDS.length
                          ],
                      }}
                      className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
                    >
                      <ProjectCard
                        project={project}
                        index={index}
                      />
                    </div>
                  )
                )}
              </div>
            </section>

            <ConsultationCTA />
          </>
        )}
    </main>
  );
}

/* =========================================================
   PROJECT CARD
========================================================= */

function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const beforeImage =
    getImageUrl(project.beforeImage);

  const afterImage =
    getImageUrl(project.afterImage);

  const fallbackImage =
    getImageUrl(project.images?.[0]);

  const beforeAlt =
    getImageAlt(
      project.beforeImage,
      `${project.title} before transformation`
    );

  const afterAlt =
    getImageAlt(
      project.afterImage,
      `${project.title} after transformation`
    );

  const hasBefore =
    Boolean(beforeImage);

  const hasAfter =
    Boolean(afterImage);

  return (
    <article className="mx-auto max-w-350">
      <Link
        href={`/projects/${project.slug}`}
        className="group block"
      >
        {/* TOP META */}

        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#CFC3B0] text-[9px] font-semibold tracking-[0.12em] text-[#6F747C] transition duration-300 group-hover:border-[#274C77] group-hover:text-[#274C77]">
              {String(index + 1).padStart(
                2,
                "0"
              )}
            </span>

            <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-[#8A847A]">
              Interior Transformation
            </span>
          </div>

          {project.featured && (
            <span className="rounded-full bg-[#EBCB84] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]">
              Featured
            </span>
          )}
        </div>

        {/* BEFORE / AFTER */}

        <div className="relative overflow-hidden bg-[#E6D8B8]">
          {/* CENTER DIVIDER ONLY — NO BUTTON */}

          <div className="pointer-events-none absolute inset-y-0 left-1/2 z-20 w-px -translate-x-1/2 bg-[#FFF7E8]/90" />

          <div className="grid grid-cols-2">
            {/* BEFORE */}

            <div className="relative aspect-4/3 overflow-hidden">
              {hasBefore ? (
                <Image
                  src={beforeImage}
                  alt={beforeAlt}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 50vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                />
              ) : fallbackImage ? (
                <Image
                  src={fallbackImage}
                  alt={`${project.title} interior`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 50vw"
                  className="object-cover opacity-60 grayscale transition duration-700 group-hover:scale-[1.025]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8A847A]">
                  No image
                </div>
              )}

              <div className="absolute left-3 top-3 sm:left-5 sm:top-5">
                <span className="bg-[#FFF7E8]/90 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A] backdrop-blur-sm">
                  Before
                </span>
              </div>
            </div>

            {/* AFTER */}

            <div className="relative aspect-4/3 overflow-hidden">
              {hasAfter ? (
                <Image
                  src={afterImage}
                  alt={afterAlt}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 50vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                />
              ) : fallbackImage ? (
                <Image
                  src={fallbackImage}
                  alt={`${project.title} interior`}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 50vw"
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8A847A]">
                  No image
                </div>
              )}

              <div className="absolute right-3 top-3 sm:right-5 sm:top-5">
                <span className="bg-[#274C77]/90 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#F3E7D0] backdrop-blur-sm">
                  After
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* PROJECT INFORMATION */}

        <div className="pt-7">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[#6F747C]">
            {project.location && (
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                {project.location}
              </span>
            )}

            {project.location &&
              project.category && (
                <span className="text-[#C79B3B]">
                  |
                </span>
              )}

            {project.category && (
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                {project.category}
              </span>
            )}

            {project.style && (
              <>
                <span className="text-[#C79B3B]">
                  |
                </span>

                <span className="text-[9px] font-semibold uppercase tracking-[0.18em]">
                  {project.style}
                </span>
              </>
            )}
          </div>

          <h2
            className="mt-4 max-w-5xl text-[clamp(2.5rem,5vw,5rem)] font-normal leading-[0.88] tracking-tight text-[#0B1F3A]"
            style={{
              fontFamily: SERIF_FONT,
            }}
          >
            {project.title}
          </h2>

          {project.description && (
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#5B6573]">
              {project.description}
            </p>
          )}

          <div className="mt-7 inline-flex items-center gap-4">
            <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#274C77] transition-colors group-hover:text-[#0B1F3A]">
              View Project
            </span>

            <span className="text-base leading-none text-[#274C77] transition-transform duration-300 group-hover:translate-x-2">
              →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* =========================================================
   CONSULTATION CTA
========================================================= */

function ConsultationCTA() {
  return (
    <section className="bg-[#FFF7E8] px-5 pb-14 pt-4 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24">
      <div className="mx-auto max-w-375">
        <div className="relative overflow-hidden bg-[#0B1F3A] px-6 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-20">
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full border border-[#F3E7D0]/10" />

          <div className="pointer-events-none absolute -bottom-32 -left-24 h-64 w-64 rounded-full border border-[#F3E7D0]/10" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#EBCB84]">
                Start your transformation
              </p>

              <h2
                className="mt-5 max-w-3xl text-[clamp(2.8rem,5.5vw,5.5rem)] font-normal leading-[0.86] tracking-tight text-[#F3E7D0]"
                style={{
                  fontFamily: SERIF_FONT,
                }}
              >
                Your space could be
                <br />
                <span className="text-[#AFC0CD]">
                  next.
                </span>
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-7 text-[#F3E7D0]/65">
                Tell us what you have in mind. We&apos;ll
                talk through your space, your ideas, and
                what it could become.
              </p>
            </div>

            <div className="flex flex-col items-start gap-5 lg:items-end">
              <div className="relative hidden h-14 w-44 sm:block">
                <svg
                  viewBox="0 0 180 55"
                  className="h-full w-full overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M5 42 C42 8, 75 8, 108 29 C124 39, 142 39, 165 16"
                    stroke="#F3E7D0"
                    strokeWidth="1.2"
                    strokeDasharray="3 5"
                    opacity="0.55"
                  />

                  <path
                    d="M157 10 L168 15 L158 21"
                    stroke="#EBCB84"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M105 24 L115 28 L106 34"
                    stroke="#EBCB84"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="absolute right-0 top-0 text-[7px] uppercase tracking-[0.2em] text-[#F3E7D0]/45">
                  let&apos;s begin
                </span>
              </div>

              <Link
                href="/consultation"
                className="group inline-flex items-center gap-5 rounded-full bg-[#274C77] px-6 py-4 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] transition duration-300 hover:bg-[#1B3554]"
              >
                <span>
                  Book Free Consultation
                </span>

                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LOADING SKELETON
========================================================= */

function ProjectSkeleton() {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 animate-pulse rounded-full bg-[#E6D8B8]" />

          <div className="h-2 w-28 animate-pulse bg-[#E6D8B8]" />
        </div>

        <div className="h-6 w-20 animate-pulse rounded-full bg-[#E6D8B8]" />
      </div>

      <div className="grid grid-cols-2 overflow-hidden">
        <div className="aspect-4/3 animate-pulse bg-[#E6D8B8]" />

        <div className="aspect-4/3 animate-pulse bg-[#E6D8B8]" />
      </div>

      <div className="pt-7">
        <div className="h-2 w-56 animate-pulse bg-[#E6D8B8]" />

        <div className="mt-5 h-12 w-2/3 animate-pulse bg-[#E6D8B8]" />

        <div className="mt-6 h-3 w-full animate-pulse bg-[#E6D8B8]" />

        <div className="mt-2 h-3 w-4/5 animate-pulse bg-[#E6D8B8]" />

        <div className="mt-7 h-3 w-24 animate-pulse bg-[#E6D8B8]" />
      </div>
    </div>
  );
}