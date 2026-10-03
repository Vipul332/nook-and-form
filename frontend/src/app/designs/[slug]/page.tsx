"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  publicDesignApi,
  type Design,
} from "@/lib/api";

function formatLabel(value: string) {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatBudget(min?: number, max?: number) {
  const formatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  if (min !== undefined && max !== undefined) {
    return `₹${formatter.format(min)} – ₹${formatter.format(max)}`;
  }

  if (min !== undefined) {
    return `From ₹${formatter.format(min)}`;
  }

  if (max !== undefined) {
    return `Up to ₹${formatter.format(max)}`;
  }

  return null;
}

/* ============================================================
   REAL COLOUR VALUES
============================================================ */

function getColorValue(color: string) {
  const normalized = color.toLowerCase().trim();

  const colorMap: Record<string, string> = {
    white: "#F7F5EF",
    ivory: "#EEE9DC",
    cream: "#F3EAD5",
    beige: "#D8C7AA",
    sand: "#D7C3A3",
    taupe: "#A89B89",

    brown: "#795548",
    tan: "#C2A477",
    mocha: "#8B6F5A",
    caramel: "#B9855A",
    terracotta: "#B86F52",

    black: "#242321",
    charcoal: "#3B3935",
    grey: "#8B8985",
    gray: "#8B8985",
    silver: "#B8B8B4",

    gold: "#C6A15B",
    brass: "#B08D57",
    bronze: "#8C6844",

    blue: "#7D9AB5",
    navy: "#334B63",
    teal: "#668F8D",

    green: "#7B8B6D",
    olive: "#777653",
    sage: "#A5AD91",
    forest: "#526452",

    pink: "#D4A6A6",
    rose: "#C98F8F",
    blush: "#D9B7AE",

    red: "#A65F58",
    orange: "#C9824D",
    yellow: "#D5B75D",

    purple: "#8D789D",
    lavender: "#AAA0BD",
  };

  return colorMap[normalized] ?? "#B7AA97";
}

export default function DesignDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;

  const [design, setDesign] = useState<Design | null>(null);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [completedRequest, setCompletedRequest] = useState<
    number | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchDesign() {
      try {
        const result =
          await publicDesignApi.getDesignBySlug(slug);

        if (cancelled) {
          return;
        }

        if (!result.success || !result.data) {
          throw new Error(
            result.message || "Failed to load design.",
          );
        }

        setDesign(result.data);
        setError("");
        setCompletedRequest(retryCount);
      } catch (err) {
        if (cancelled) {
          return;
        }

        setDesign(null);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load design.",
        );

        setCompletedRequest(retryCount);
      }
    }

    if (slug) {
      void fetchDesign();
    }

    return () => {
      cancelled = true;
    };
  }, [slug, retryCount]);

  const loading =
    Boolean(slug) &&
    !error &&
    completedRequest !== retryCount;

  function handleRetry() {
    setError("");
    setRetryCount((count) => count + 1);
  }

  /* ============================================================
     MISSING SLUG
  ============================================================ */

  if (!slug) {
    return (
      <main className="min-h-screen bg-[#f5efe5] px-6 py-20 text-[#29251f] sm:px-10 lg:px-16">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#897d6c]">
            Design Collection
          </p>

          <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] sm:text-6xl">
            Design not found.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#777168]">
            The design you are looking for could not be
            found.
          </p>

          <Link
            href="/designs"
            className="mt-8 inline-flex items-center gap-4 rounded-full bg-[#29251f] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-[#f5efe5] transition-all duration-300 hover:bg-[#4a443b]"
          >
            <span>←</span>
            Back to Designs
          </Link>
        </div>
      </main>
    );
  }

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5efe5] text-[#29251f]">
        <header className="border-b border-[#29251f]/10">
          <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
            <div className="h-4 w-28 animate-pulse bg-[#e5dbcc]" />

            <div className="h-7 w-24 animate-pulse bg-[#e5dbcc]" />

            <div className="hidden h-4 w-24 animate-pulse bg-[#e5dbcc] sm:block" />
          </div>
        </header>

        <div className="mx-auto max-w-350 px-6 py-10 sm:px-10 lg:px-16">
          <div className="animate-pulse">
            <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
              <div className="aspect-4/3 rounded-[26px] bg-[#e5dbcc]" />

              <div className="flex flex-col justify-center">
                <div className="h-8 w-56 rounded-full bg-[#e5dbcc]" />

                <div className="mt-8 h-14 w-4/5 bg-[#e5dbcc]" />

                <div className="mt-5 h-5 w-3/5 bg-[#e5dbcc]" />

                <div className="mt-10 h-24 rounded-[20px] bg-[#e5dbcc]" />

                <div className="mt-10 h-20 rounded-[20px] bg-[#e5dbcc]" />

                <div className="mt-8 flex gap-3">
                  <div className="h-10 w-24 rounded-full bg-[#e5dbcc]" />
                  <div className="h-10 w-24 rounded-full bg-[#e5dbcc]" />
                  <div className="h-10 w-24 rounded-full bg-[#e5dbcc]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ============================================================
     ERROR
  ============================================================ */

  if (!design) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#f5efe5] px-6 py-20 text-[#29251f] sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full border border-[#bca98d]/20" />

        <div className="pointer-events-none absolute -right-40 bottom-20 h-96 w-96 rounded-full border border-[#bca98d]/20" />

        <div className="relative mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="text-[10px] uppercase tracking-[0.32em] text-[#897d6c]">
            Design Collection
          </p>

          <h1 className="mt-5 font-serif text-4xl font-light tracking-[-0.03em] sm:text-6xl">
            Design not found.
          </h1>

          <p className="mt-5 max-w-md text-sm leading-7 text-[#777168]">
            {error ||
              "This design may no longer be available."}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/designs"
              className="inline-flex items-center gap-4 rounded-full bg-[#29251f] px-7 py-4 text-[10px] uppercase tracking-[0.2em] text-[#f5efe5] transition-all duration-300 hover:bg-[#4a443b]"
            >
              <span>←</span>
              Back to Designs
            </Link>

            <button
              type="button"
              onClick={handleRetry}
              className="rounded-full border border-[#29251f]/20 px-7 py-4 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 hover:bg-[#29251f] hover:text-[#f5efe5]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const images = design.images ?? [];
  const currentImage = images[0];

  const budget = formatBudget(
    design.budgetMin,
    design.budgetMax,
  );

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f5efe5] text-[#29251f]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="relative z-10 border-b border-[#29251f]/10 bg-[#f5efe5]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-350 items-center justify-between px-6 py-5 sm:px-10 lg:px-16">
          <Link
            href="/designs"
            className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-[#70685d] transition-colors hover:text-[#29251f]"
          >
            <span className="text-lg transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>

            <span>Back to Designs</span>
          </Link>

          <Link
            href="/"
            className="font-serif text-2xl tracking-[-0.03em] text-[#29251f]"
          >
            Interior
          </Link>

          <span className="hidden text-[10px] uppercase tracking-[0.2em] text-[#70685d] sm:block">
            Design Collection
          </span>
        </div>
      </header>

      {/* =====================================================
          MAIN PROJECT AREA
          HERO IMAGE + PROJECT INFORMATION
      ===================================================== */}

      <section className="relative z-10 px-6 pb-24 pt-10 sm:px-10 sm:pt-14 lg:px-16 lg:pb-32 lg:pt-20">
        <div className="mx-auto max-w-350">

          <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 xl:gap-20">

            {/* =================================================
                MAIN HERO IMAGE
            ================================================= */}

            <div className="relative">

              <div className="absolute -bottom-4 -left-4 h-full w-full rounded-[30px] border border-[#bca98d]/25" />

              <div className="relative overflow-hidden rounded-[26px] bg-[#e3d8c8] shadow-[0_25px_70px_rgba(55,45,32,0.12)]">

                {currentImage?.url ? (
                  <Image
                    src={currentImage.url}
                    alt={
                      currentImage.alt ||
                      design.title
                    }
                    width={1800}
                    height={1250}
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="aspect-4/3 w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-4/3 items-center justify-center text-[10px] uppercase tracking-[0.2em] text-[#8a8073]">
                    No Image Available
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />
              </div>
            </div>

            {/* =================================================
                PROJECT INFORMATION
            ================================================= */}

            <div className="relative">

              {/* ROOM / STYLE / FEATURED */}

              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-[#29251f]/10 bg-[#ede4d7] px-4 py-2 text-[9px] uppercase tracking-[0.14em] text-[#625b50]">
                  {formatLabel(design.roomType)}
                </span>

                <span className="rounded-full border border-[#29251f]/10 bg-[#ede4d7] px-4 py-2 text-[9px] uppercase tracking-[0.14em] text-[#625b50]">
                  {formatLabel(design.style)}
                </span>

                {design.featured && (
                  <span className="rounded-full bg-[#d9b77d] px-4 py-2 text-[9px] uppercase tracking-[0.14em] text-[#392f21]">
                    Featured
                  </span>
                )}
              </div>

              {/* TITLE */}

              <h1 className="mt-7 max-w-2xl font-serif text-5xl font-light leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl xl:text-[78px]">
                {design.title}
              </h1>

              {/* DESCRIPTION */}

              {design.description && (
                <p className="mt-6 max-w-xl text-sm leading-7 text-[#756e63] sm:text-base">
                  {design.description}
                </p>
              )}

              {/* DIVIDER */}

              <div className="my-9 flex items-center gap-4">
                <span className="h-px w-12 bg-[#a89372]" />

                <span className="text-[9px] uppercase tracking-[0.28em] text-[#988d7d]">
                  Project Details
                </span>
              </div>

              {/* BUDGET */}

              {budget && (
                <div className="rounded-[20px] border border-[#29251f]/10 bg-[#f8f2e8]/80 px-6 py-6">
                  <p className="text-[9px] uppercase tracking-[0.25em] text-[#8c8172]">
                    Estimated Budget
                  </p>

                  <p className="mt-3 font-serif text-2xl font-light tracking-[-0.02em] text-[#29251f] sm:text-3xl">
                    {budget}
                  </p>
                </div>
              )}

              {/* =================================================
                  SIGNIFICANT COLOUR PALETTE
              ================================================= */}

              {design.colors &&
                design.colors.length > 0 && (
                  <div className="mt-8 border-t border-[#29251f]/10 pt-7">

                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.25em] text-[#817668]">
                          Colour Palette
                        </p>

                        <p className="mt-2 font-serif text-2xl font-light text-[#29251f]">
                          The tones of the space.
                        </p>
                      </div>

                      <span className="hidden text-[9px] uppercase tracking-[0.18em] text-[#a09688] sm:block">
                        {design.colors.length}{" "}
                        {design.colors.length === 1
                          ? "Colour"
                          : "Colours"}
                      </span>
                    </div>

                    {/* LARGE REAL SWATCHES */}

                    <div className="mt-6 flex flex-wrap gap-5">
                      {design.colors.map((color) => (
                        <div
                          key={color}
                          className="group"
                        >
                          <div
                            className="h-20 w-20 rounded-full border border-[#29251f]/15 shadow-[0_8px_25px_rgba(41,37,31,0.12)] transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 sm:h-24 sm:w-24"
                            style={{
                              backgroundColor:
                                getColorValue(color),
                            }}
                            aria-label={`Colour: ${formatLabel(
                              color,
                            )}`}
                          />

                          <p className="mt-3 text-center text-[10px] uppercase tracking-[0.12em] text-[#625b50]">
                            {formatLabel(color)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* =================================================
                  MATERIALS
              ================================================= */}

              {design.materials &&
                design.materials.length > 0 && (
                  <div className="mt-9 border-t border-[#29251f]/10 pt-7">

                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#817668]">
                      Materials
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      {design.materials.map(
                        (material) => (
                          <span
                            key={material}
                            className="rounded-full border border-[#29251f]/10 bg-[#f8f2e8]/80 px-5 py-2.5 text-xs text-[#5e574d]"
                          >
                            {formatLabel(material)}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* =================================================
                  PROJECT TAGS
              ================================================= */}

              {design.tags &&
                design.tags.length > 0 && (
                  <div className="mt-8 border-t border-[#29251f]/10 pt-7">

                    <p className="text-[9px] uppercase tracking-[0.25em] text-[#817668]">
                      Project Tags
                    </p>

                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                      {design.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-[#756e63]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}