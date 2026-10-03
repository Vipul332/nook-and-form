"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  publicProjectApi,
  type Project,
} from "@/lib/api";

/* =========================================================
   DESIGN SYSTEM
========================================================= */

const SERIF_FONT =
  "Georgia, 'Times New Roman', serif";

const SANS_FONT =
  "Arial, Helvetica, sans-serif";

/* =========================================================
   IMAGE HELPERS
========================================================= */

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

    if (
      typeof alt === "string" &&
      alt.trim()
    ) {
      return alt;
    }
  }

  return fallback;
}

/* =========================================================
   PAGE
========================================================= */

export default function ProjectDetailPage() {
  const params =
    useParams<{ slug: string }>();

  const slug = params.slug;

  const [project, setProject] =
    useState<Project | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     DOCUMENT SCROLL BEHAVIOR
  ======================================================== */

  useEffect(() => {
    const root =
      document.documentElement;

    const body =
      document.body;

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

    root.style.backgroundColor =
      "#FFF7E8";

    body.style.backgroundColor =
      "#FFF7E8";

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

  /* =======================================================
     FETCH PROJECT
  ======================================================== */

  useEffect(() => {
    let cancelled = false;

    async function fetchProject() {
      try {
        setLoading(true);

        const result =
          await publicProjectApi.getProjectBySlug(
            slug
          );

        if (!cancelled) {
          if (
            !result.success ||
            !result.data
          ) {
            throw new Error(
              result.message ||
                "Failed to load project."
            );
          }

          setProject(result.data);
          setError("");
        }
      } catch (err: unknown) {
        if (!cancelled) {
          setProject(null);

          setError(
            err instanceof Error
              ? err.message
              : "Failed to load project."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (slug) {
      void fetchProject();
    }

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /* =======================================================
     LOADING
  ======================================================== */

  if (loading) {
    return (
      <main
        className="flex min-h-screen items-center justify-center bg-[#FFF7E8] px-6 text-[#0B1F3A]"
        style={{
          fontFamily: SANS_FONT,
        }}
      >
        <div className="text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.32em] text-[#274C77]">
            Selected Project
          </p>

          <div className="mx-auto mt-7 h-px w-12 bg-[#C79B3B]" />

          <p
            className="mt-7 text-5xl font-normal sm:text-6xl"
            style={{
              fontFamily: SERIF_FONT,
            }}
          >
            Loading
          </p>
        </div>
      </main>
    );
  }

  /* =======================================================
     ERROR
  ======================================================== */

  if (error || !project) {
    return (
      <main
        className="min-h-screen bg-[#FFF7E8] px-5 py-16 text-[#0B1F3A] sm:px-8 lg:px-12"
        style={{
          fontFamily: SANS_FONT,
        }}
      >
        <div className="mx-auto flex min-h-[70vh] max-w-375 items-center justify-center">
          <div className="w-full max-w-2xl bg-[#F3E7D0] px-7 py-16 text-center sm:px-12">
            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#274C77]">
              Project unavailable
            </p>

            <h1
              className="mt-5 text-5xl font-normal leading-[0.9] sm:text-6xl"
              style={{
                fontFamily: SERIF_FONT,
              }}
            >
              Project
              <br />
              not found.
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#5B6573]">
              {error ||
                "This project may no longer be available."}
            </p>

            <Link
              href="/projects"
              className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#274C77] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] transition duration-300 hover:bg-[#0B1F3A]"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">
                ←
              </span>

              Back to Projects
            </Link>
          </div>
        </div>
      </main>
    );
  }

  /* =======================================================
     NORMALIZED DATA
  ======================================================== */

  const beforeImage =
    getImageUrl(
      project.beforeImage
    );

  const afterImage =
    getImageUrl(
      project.afterImage
    );

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

  const galleryImages =
    project.images ?? [];

  const materials =
    project.materials ?? [];

  const hasBefore =
    Boolean(beforeImage);

  const hasAfter =
    Boolean(afterImage);

  const hasTransformation =
    hasBefore || hasAfter;

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#FFF7E8] text-[#0B1F3A]"
      style={{
        fontFamily: SANS_FONT,
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-[#D6C8AF]/60 bg-[#FFF7E8]">
        <div className="mx-auto flex max-w-375 items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#5B6573] transition duration-300 hover:text-[#0B1F3A]"
          >
            <span className="text-base transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            All Projects
          </Link>

          <Link
            href="/consultation"
            className="inline-flex items-center rounded-full bg-[#274C77] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#F3E7D0] transition duration-300 hover:bg-[#0B1F3A]"
          >
            Consultation

            <span className="ml-2 text-sm">
              →
            </span>
          </Link>
        </div>
      </header>

      {/* =================================================
          HERO / PROJECT INTRO
      ================================================= */}

      <section className="px-5 pb-12 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-12 lg:pb-20 lg:pt-24">
        <div className="mx-auto max-w-375">
          <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-[#CFC3B0] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.22em] text-[#6F747C]">
                  Project
                </span>

                {project.featured && (
                  <span className="rounded-full bg-[#EBCB84] px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]">
                    Featured
                  </span>
                )}
              </div>

              <h1
                className="mt-7 max-w-6xl text-[clamp(3.5rem,8vw,8.5rem)] font-normal leading-[0.78] tracking-[-0.055em]"
                style={{
                  fontFamily: SERIF_FONT,
                }}
              >
                {project.title}
              </h1>
            </div>

            <div className="border-l border-[#CFC3B0] pl-6 lg:pb-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-[#8A847A]">
                Project overview
              </p>

              {project.location && (
                <p className="mt-4 text-sm font-medium text-[#0B1F3A]">
                  {project.location}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {project.category && (
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#274C77]">
                    {project.category}
                  </span>
                )}

                {project.category &&
                  project.style && (
                    <span className="text-[#C79B3B]">
                      /
                    </span>
                  )}

                {project.style && (
                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#274C77]">
                    {project.style}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          TRANSFORMATION
      ================================================= */}

      {hasTransformation && (
        <section className="px-5 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-375">
            <div className="mb-5 flex items-end justify-between gap-6">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#274C77]">
                  The transformation
                </p>

                <p className="mt-2 text-sm text-[#6F747C]">
                  Before &amp; after
                </p>
              </div>

              <span className="hidden text-[8px] font-bold uppercase tracking-[0.24em] text-[#8A847A] sm:block">
                From existing to intentional
              </span>
            </div>

            <div className="relative overflow-hidden bg-[#E6D8B8]">
              <div className="grid md:grid-cols-2">
                {/* BEFORE */}

                <div className="relative aspect-4/3 overflow-hidden md:aspect-[1.08/0.82]">
                  {hasBefore ? (
                    <Image
                      src={beforeImage}
                      alt={beforeAlt}
                      fill
                      priority
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 ease-out hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A847A]">
                      No before image
                    </div>
                  )}

                  <div className="absolute left-5 top-5 sm:left-7 sm:top-7">
                    <span className="bg-[#FFF7E8]/95 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#0B1F3A]">
                      01 — Before
                    </span>
                  </div>
                </div>

                {/* AFTER */}

                <div className="relative aspect-4/3 overflow-hidden md:aspect-[1.08/0.82]">
                  {hasAfter ? (
                    <Image
                      src={afterImage}
                      alt={afterAlt}
                      fill
                      priority
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-700 ease-out hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[9px] font-bold uppercase tracking-[0.2em] text-[#8A847A]">
                      No after image
                    </div>
                  )}

                  <div className="absolute right-5 top-5 sm:right-7 sm:top-7">
                    <span className="bg-[#274C77]/95 px-4 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-[#F3E7D0]">
                      02 — After
                    </span>
                  </div>
                </div>
              </div>

              {/* DIVIDER */}

              <div className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-[#FFF7E8]/80 md:block" />
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          PROJECT STORY
      ================================================= */}

      <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <div className="mx-auto grid max-w-312.5 gap-14 lg:grid-cols-[1.35fr_0.65fr] lg:gap-24">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#274C77]">
              The project
            </p>

            <h2
              className="mt-5 max-w-4xl text-[clamp(3rem,5.4vw,6rem)] font-normal leading-[0.86] tracking-[-0.035em]"
              style={{
                fontFamily: SERIF_FONT,
              }}
            >
              Designed around
              <br />
              the way life unfolds.
            </h2>

            <div className="mt-8 h-px w-16 bg-[#C79B3B]" />

            <p className="mt-8 max-w-3xl whitespace-pre-line text-sm leading-8 text-[#5B6573] sm:text-base">
              {project.description}
            </p>
          </div>

          {/* DETAILS */}

          <aside className="self-start border-t border-[#CFC3B0] pt-6">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8A847A]">
              Project details
            </p>

            <div className="mt-5 divide-y divide-[#D6C8AF]">
              {project.location && (
                <DetailRow
                  label="Location"
                  value={project.location}
                />
              )}

              {project.category && (
                <DetailRow
                  label="Category"
                  value={project.category}
                />
              )}

              {project.style && (
                <DetailRow
                  label="Style"
                  value={project.style}
                />
              )}

              <DetailRow
                label="Status"
                value={
                  project.featured
                    ? "Featured project"
                    : "Completed project"
                }
              />
            </div>
          </aside>
        </div>
      </section>

      {/* =================================================
          GALLERY
      ================================================= */}

      {galleryImages.length > 0 && (
        <section className="bg-[#F3E7D0] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="mx-auto max-w-375">
            <div className="grid gap-8 border-b border-[#D6C8AF] pb-10 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#274C77]">
                  Inside the space
                </p>

                <h2
                  className="mt-4 text-[clamp(3rem,5.5vw,6rem)] font-normal leading-[0.84] tracking-[-0.04em]"
                  style={{
                    fontFamily: SERIF_FONT,
                  }}
                >
                  The details.
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-7 text-[#5B6573] lg:pb-1">
                A closer look at the spaces,
                materials, furniture and
                details that complete the
                design.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
              {galleryImages.map(
                (
                  image,
                  index
                ) => {
                  const imageUrl =
                    getImageUrl(image);

                  if (!imageUrl) {
                    return null;
                  }

                  const imageAlt =
                    getImageAlt(
                      image,
                      `${project.title} project detail ${
                        index + 1
                      }`
                    );

                  const layoutClass =
                    index === 0
                      ? "sm:col-span-2 lg:col-span-8"
                      : index === 1
                        ? "lg:col-span-4"
                        : index === 2
                          ? "lg:col-span-4"
                          : index === 3
                            ? "sm:col-span-2 lg:col-span-8"
                            : "lg:col-span-4";

                  const aspectClass =
                    index === 0 ||
                    index === 3
                      ? "aspect-[16/10]"
                      : "aspect-[4/3]";

                  return (
                    <div
                      key={`${imageUrl}-${index}`}
                      className={`group relative overflow-hidden bg-[#E6D8B8] ${layoutClass}`}
                    >
                      <div
                        className={`relative ${aspectClass}`}
                      >
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          unoptimized
                          sizes={
                            index === 0 ||
                            index === 3
                              ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          }
                          className="object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                        />
                      </div>

                      <div className="absolute bottom-4 left-4">
                        <span className="bg-[#FFF7E8]/92 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-[#0B1F3A] backdrop-blur-sm">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          MATERIALS
      ================================================= */}

      {materials.length > 0 && (
        <section className="px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
          <div className="mx-auto grid max-w-312.5 gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-20">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#274C77]">
                Material language
              </p>

              <h2
                className="mt-4 text-[clamp(3rem,5vw,5.5rem)] font-normal leading-[0.86] tracking-[-0.035em]"
                style={{
                  fontFamily: SERIF_FONT,
                }}
              >
                Texture,
                <br />
                tone &amp; form.
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-[#5B6573]">
                A considered palette of materials
                creates the foundation for the
                finished space.
              </p>
            </div>

            <div className="grid grid-cols-1 border-t border-[#CFC3B0] sm:grid-cols-2">
              {materials.map(
                (
                  material,
                  index
                ) => (
                  <div
                    key={`${material}-${index}`}
                    className="flex items-center justify-between border-b border-[#CFC3B0] py-5 sm:pr-6"
                  >
                    <span className="text-sm font-medium capitalize text-[#0B1F3A]">
                      {material}
                    </span>

                    <span className="text-[8px] font-bold tracking-[0.18em] text-[#A69C8C]">
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </section>
      )}

      {/* =================================================
          FINAL CTA
      ================================================= */}

      <section className="px-5 pb-12 pt-2 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <div className="mx-auto max-w-375">
          <div className="relative overflow-hidden bg-[#0B1F3A] px-6 py-14 sm:px-10 sm:py-18 lg:px-16 lg:py-24">
            {/* Decorative lines */}

            <div className="pointer-events-none absolute -right-22.5 -top-22.5 h-72 w-72 rounded-full border border-[#F3E7D0]/10" />

            <div className="pointer-events-none absolute -bottom-25 -left-17.5 h-64 w-64 rounded-full border border-[#F3E7D0]/10" />

            <div className="pointer-events-none absolute right-10 top-10 hidden h-20 w-20 border border-[#EBCB84]/20 lg:block" />

            <div className="relative grid gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#EBCB84]">
                  Your project could be next
                </p>

                <h2
                  className="mt-5 max-w-4xl text-[clamp(3.2rem,6vw,7rem)] font-normal leading-[0.8] tracking-[-0.04em] text-[#F3E7D0]"
                  style={{
                    fontFamily: SERIF_FONT,
                  }}
                >
                  Let&apos;s create
                  <br />
                  <span className="text-[#AFC0CD]">
                    your space.
                  </span>
                </h2>

                <p className="mt-7 max-w-xl text-sm leading-7 text-[#F3E7D0]/65">
                  Tell us about your space,
                  your ideas and what you
                  want it to become.
                </p>
              </div>

              <Link
                href="/consultation"
                className="group inline-flex w-fit items-center gap-5 rounded-full bg-[#274C77] px-7 py-4 text-[9px] font-bold uppercase tracking-[0.22em] text-[#F3E7D0] transition duration-300 hover:bg-[#1B3554]"
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
      </section>
    </main>
  );
}

/* =========================================================
   DETAIL ROW
========================================================= */

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-5 py-4">
      <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#8A847A]">
        {label}
      </span>

      <span className="text-right text-sm font-semibold capitalize text-[#0B1F3A]">
        {value}
      </span>
    </div>
  );
}