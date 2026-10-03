"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { publicDesignApi, type Design } from "@/lib/api";

const ROOM_FILTERS = [
  { label: "All", value: "" },
  { label: "Living", value: "living-room" },
  { label: "Kitchen", value: "kitchen" },
  { label: "Bedroom", value: "bedroom" },
  { label: "Dining", value: "dining-room" },
  { label: "Bathroom", value: "bathroom" },
];

const STYLE_OPTIONS = [
  { label: "All styles", value: "" },
  { label: "Modern", value: "modern" },
  { label: "Minimalist", value: "minimalist" },
  { label: "Traditional", value: "traditional" },
  { label: "Indian", value: "indian" },
  { label: "Royal", value: "royal" },
  { label: "Aesthetic", value: "aesthetic" },
];

function formatLabel(value?: string) {
  if (!value) return "";

  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getImageUrl(design?: Design) {
  return design?.images?.[0]?.url || "";
}

function DesignImage({
  design,
  priority = false,
  sizes,
  className = "",
}: {
  design: Design;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  const imageUrl = getImageUrl(design);

  if (!imageUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#e7e1d7] text-[10px] uppercase tracking-[0.22em] text-[#777167]">
        No image available
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={
        design.images?.[0]?.alt ||
        design.title ||
        "Interior design project"
      }
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035] ${className}`}
    />
  );
}

function Meta({
  design,
  light = false,
}: {
  design: Design;
  light?: boolean;
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-medium uppercase tracking-[0.24em] ${
        light ? "text-white/70" : "text-[#766f64]"
      }`}
    >
      {design.roomType && (
        <span>{formatLabel(design.roomType)}</span>
      )}

      {design.style && (
        <>
          <span
            className={
              light ? "text-white/35" : "text-[#b5aa9a]"
            }
          >
            /
          </span>

          <span>{formatLabel(design.style)}</span>
        </>
      )}
    </div>
  );
}

function ProjectCard({
  design,
  large = false,
  priority = false,
}: {
  design: Design;
  large?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/designs/${design.slug}`}
      className="group block h-full focus:outline-none"
      aria-label={`View ${design.title || "design project"}`}
    >
      <article
        className={`relative h-full overflow-hidden border border-[#292820]/10 bg-[#e7e1d7] ${
          large
            ? "min-h-97.5 sm:min-h-117.5 lg:min-h-125"
            : "min-h-90 sm:min-h-67.5"
        }`}
      >
        <DesignImage
          design={design}
          priority={priority}
          sizes={
            large
              ? "(max-width: 768px) 100vw, 62vw"
              : "(max-width: 768px) 100vw, 38vw"
          }
        />

        <div className="absolute inset-0 bg-linear-to-t from-[#171713]/95 via-[#171713]/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="pointer-events-none absolute inset-0 border border-white/0 transition-colors duration-500 group-hover:border-white/20" />

        <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
          <Meta design={design} light />

          <h2
            className={`mt-3 max-w-2xl font-serif font-normal leading-[0.96] tracking-tight ${
              large
                ? "text-[2.45rem] sm:text-[3.3rem] lg:text-[4.1rem]"
                : "text-[2rem] sm:text-[2.5rem]"
            }`}
          >
            {design.title}
          </h2>

          {large && design.description && (
            <p className="mt-4 max-w-xl text-[13px] leading-6 text-white/72 sm:text-sm">
              {design.description}
            </p>
          )}

          <span className="mt-6 inline-flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-white transition-all duration-300 group-hover:gap-4">
            View Project

            <span
              aria-hidden="true"
              className="text-sm leading-none text-[#d2b38d]"
            >
              →
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function DesignsPage() {
  const [designs, setDesigns] = useState<Design[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("");
  const [style, setStyle] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /*
   * Keep the document itself as the only vertical scrolling surface.
   */
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const previousRootBackground = root.style.backgroundColor;
    const previousBodyBackground = body.style.backgroundColor;
    const previousRootOverscroll = root.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    const previousRootOverflowX = root.style.overflowX;
    const previousBodyOverflowX = body.style.overflowX;
    const previousRootOverflowY = root.style.overflowY;
    const previousBodyOverflowY = body.style.overflowY;
    const previousRootTouchAction = root.style.touchAction;
    const previousBodyTouchAction = body.style.touchAction;
    const previousRootHeight = root.style.height;
    const previousBodyMinHeight = body.style.minHeight;
    const previousBodyOverflow = body.style.overflow;

    root.style.backgroundColor = "#f4f1eb";
    body.style.backgroundColor = "#f4f1eb";

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
      root.style.backgroundColor = previousRootBackground;
      body.style.backgroundColor = previousBodyBackground;

      root.style.overscrollBehavior = previousRootOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;

      root.style.overflowX = previousRootOverflowX;
      body.style.overflowX = previousBodyOverflowX;

      root.style.overflowY = previousRootOverflowY;
      body.style.overflowY = previousBodyOverflowY;

      root.style.touchAction = previousRootTouchAction;
      body.style.touchAction = previousBodyTouchAction;

      root.style.height = previousRootHeight;
      body.style.minHeight = previousBodyMinHeight;
      body.style.overflow = previousBodyOverflow;
    };
  }, []);

  /*
   * API FLOW
   *
   * Important:
   * publicDesignApi.getDesigns() returns ApiResponse<DesignListData>.
   * Therefore the design list is inside result.data.
   */
  useEffect(() => {
    let cancelled = false;

    const fetchDesigns = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await publicDesignApi.getDesigns({
          search: search.trim() || undefined,
          roomType: roomType || undefined,
          style: style || undefined,
        });

        if (!cancelled) {
          setDesigns(result.data?.items ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load designs."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void fetchDesigns();

    return () => {
      cancelled = true;
    };
  }, [search, roomType, style, retryCount]);

  const handleRetry = () => {
    setLoading(true);
    setRetryCount((count) => count + 1);
  };

  const featured = designs[0];
  const sideProjects = designs.slice(1, 3);
  const lowerProjects = designs.slice(3, 5);
  const fullBleedProject = designs[5];

  return (
    <>
      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="fixed inset-x-0 top-0 z-100 border-b border-white/10 bg-[#151510]/75 shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl">
        <div className="mx-auto flex h-19 w-full max-w-360 items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Interior Studio home"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-[#d2b38d]/70 text-[13px] font-medium text-[#d2b38d] transition-colors duration-300 group-hover:border-[#d2b38d]">
              I
            </span>

            <span className="hidden sm:block">
              <span className="block text-[11px] font-medium uppercase tracking-[0.28em] text-[#f4f1eb]">
                Interior
              </span>

              <span className="mt-0.5 block text-[8px] uppercase tracking-[0.3em] text-white/45">
                Studio
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link
              href="/"
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/designs"
              className="relative text-[10px] font-medium uppercase tracking-[0.2em] text-[#d2b38d]"
            >
              Designs

              <span className="absolute -bottom-3 left-0 h-px w-full bg-[#d2b38d]" />
            </Link>

            <Link
              href="/#services"
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              Services
            </Link>

            <Link
              href="/#portfolio"
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              Portfolio
            </Link>

            <Link
              href="/#about"
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              About
            </Link>

            <Link
              href="/#contact"
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white">
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white">
                  Sign up
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>

            <Link
              href="/consultation"
              className="border border-[#d2b38d]/70 px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f4f1eb] transition-all duration-300 hover:border-[#d2b38d] hover:bg-[#d2b38d] hover:text-[#151510]"
            >
              Schedule Appointment
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={
              mobileMenuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={mobileMenuOpen}
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-white lg:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 block h-px w-full bg-white transition-transform duration-300 ${
                  mobileMenuOpen
                    ? "translate-y-1.75 rotate-45"
                    : ""
                }`}
              />

              <span
                className={`absolute left-0 top-1.75 block h-px w-full bg-white transition-opacity duration-300 ${
                  mobileMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              />

              <span
                className={`absolute bottom-0 left-0 block h-px w-full bg-white transition-transform duration-300 ${
                  mobileMenuOpen
                    ? "-translate-y-1.75 -rotate-45"
                    : ""
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* =========================================================
          MOBILE NAVIGATION
      ========================================================= */}
      <div
        className={`fixed inset-x-0 top-19 z-90 border-b border-white/10 bg-[#151510] transition-all duration-300 lg:hidden ${
          mobileMenuOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-4 opacity-0"
        }`}
      >
        <nav className="px-6 py-7 sm:px-8">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-white/10 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white/65"
            >
              Home
            </Link>

            <Link
              href="/designs"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-white/10 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-[#d2b38d]"
            >
              Designs
            </Link>

            <Link
              href="/#services"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-white/10 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white/65"
            >
              Services
            </Link>

            <Link
              href="/#portfolio"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-white/10 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white/65"
            >
              Portfolio
            </Link>

            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-white/10 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white/65"
            >
              About
            </Link>

            <Link
              href="/#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block border-b border-white/10 py-4 text-[10px] font-medium uppercase tracking-[0.25em] text-white/65"
            >
              Contact
            </Link>
          </div>

          <Link
            href="/consultation"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-6 block border border-[#d2b38d] px-5 py-4 text-center text-[9px] font-semibold uppercase tracking-[0.2em] text-[#d2b38d]"
          >
            Schedule Appointment
          </Link>

          <div className="mt-5 flex items-center gap-5">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="text-[9px] uppercase tracking-[0.2em] text-white/55">
                  Sign in
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button className="text-[9px] uppercase tracking-[0.2em] text-white/55">
                  Sign up
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </nav>
      </div>

      {/* =========================================================
          PAGE
      ========================================================= */}
      <main
        className="min-h-screen w-full bg-[#f4f1eb] pt-19 text-[#292820]"
        style={{ fontFamily: "var(--font-sans, sans-serif)" }}
      >
        {/* =====================================================
            EDITORIAL HERO
        ===================================================== */}
        <section className="px-5 pb-7 pt-8 sm:px-8 sm:pb-9 sm:pt-10 lg:px-12 lg:pb-11 lg:pt-12">
          <div className="mx-auto max-w-360">
            <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#b29573]" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#756d62]">
                    Our Design Collection
                  </span>
                </div>

                <h1 className="max-w-4xl font-serif text-[3.2rem] font-normal leading-[0.94] tracking-[-0.035em] text-[#292820] sm:text-[4.6rem] lg:text-[6.2rem]">
                  Spaces that{" "}
                  <em className="text-[#9c8061]">
                    tell a story.
                  </em>
                </h1>
              </div>

              <div className="max-w-md pb-1 lg:justify-self-end">
                <p className="text-[13px] leading-6 text-[#6f6a61] sm:text-sm">
                  Explore a collection of thoughtfully designed interiors,
                  each shaped around the people, materials and moments
                  that make a space feel like home.
                </p>

                <div className="mt-6 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.24em] text-[#9c8061]">
                  <span>Explore</span>
                  <span className="h-px w-8 bg-[#b29573]" />
                  <span>{designs.length} Projects</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            FILTER BAR
        ===================================================== */}
        <section className="sticky top-19 z-40 border-y border-[#292820]/10 bg-[#f4f1eb]/95 backdrop-blur-md">
          <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
            <div className="flex flex-col gap-4 py-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {ROOM_FILTERS.map((filter) => {
                  const active = roomType === filter.value;

                  return (
                    <button
                      key={filter.value || "all"}
                      type="button"
                      onClick={() => setRoomType(filter.value)}
                      className={`relative shrink-0 px-3 py-2 text-[9px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 sm:px-4 ${
                        active
                          ? "text-[#292820]"
                          : "text-[#817a70] hover:text-[#292820]"
                      }`}
                    >
                      {filter.label}

                      {active && (
                        <span className="absolute inset-x-3 -bottom-px h-px bg-[#9c8061] sm:inset-x-4" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative">
                  <input
                    type="search"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search designs"
                    aria-label="Search designs"
                    className="h-10 w-full border-b border-[#292820]/20 bg-transparent px-0 pr-8 text-[11px] text-[#292820] outline-none placeholder:text-[#958d82] focus:border-[#9c8061] sm:w-48"
                  />

                  <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#958d82]">
                    ⌕
                  </span>
                </div>

                <div className="relative">
                  <select
                    value={style}
                    onChange={(event) =>
                      setStyle(event.target.value)
                    }
                    aria-label="Filter by design style"
                    className="h-10 w-full appearance-none border-b border-[#292820]/20 bg-transparent px-0 pr-8 text-[10px] uppercase tracking-[0.15em] text-[#6f6a61] outline-none focus:border-[#9c8061] sm:w-36"
                  >
                    {STYLE_OPTIONS.map((option) => (
                      <option
                        key={option.value || "all-styles"}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-xs text-[#958d82]">
                    ↓
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            GALLERY
        ===================================================== */}
        <section className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="mx-auto max-w-360">
            {loading && (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
                  <div className="min-h-97.5 animate-pulse bg-[#e7e1d7] sm:min-h-117.5 lg:min-h-125" />

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    <div className="min-h-67.5 animate-pulse bg-[#e7e1d7]" />
                    <div className="min-h-67.5 animate-pulse bg-[#e7e1d7]" />
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="min-h-80 animate-pulse bg-[#e7e1d7]" />
                  <div className="min-h-80 animate-pulse bg-[#e7e1d7]" />
                </div>
              </div>
            )}

            {!loading && error && (
              <div className="border border-[#292820]/10 bg-[#ebe5db] px-6 py-16 text-center sm:px-10">
                <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#9c8061]">
                  Something went wrong
                </span>

                <h2 className="mt-4 font-serif text-3xl font-normal text-[#292820]">
                  We couldn&apos;t load the collection.
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#706a61]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-7 border border-[#292820]/30 px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#292820] transition-colors hover:border-[#292820] hover:bg-[#292820] hover:text-[#f4f1eb]"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && designs.length === 0 && (
              <div className="border border-[#292820]/10 bg-[#ebe5db] px-6 py-20 text-center sm:px-10">
                <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#9c8061]">
                  No projects found
                </span>

                <h2 className="mt-4 font-serif text-3xl font-normal text-[#292820]">
                  Nothing matches your filters.
                </h2>

                <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#706a61]">
                  Try another room, style or search term to explore
                  more of our collection.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setRoomType("");
                    setStyle("");
                  }}
                  className="mt-7 border border-[#292820]/30 px-6 py-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#292820] transition-colors hover:border-[#292820] hover:bg-[#292820] hover:text-[#f4f1eb]"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!loading && !error && featured && (
              <div className="grid gap-5 lg:grid-cols-[1.45fr_0.85fr]">
                <ProjectCard
                  design={featured}
                  large
                  priority
                />

                {sideProjects.length > 0 && (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                    {sideProjects.map((design) => (
                      <ProjectCard
                        key={design._id || design.slug}
                        design={design}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {!loading &&
              !error &&
              lowerProjects.length > 0 && (
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  {lowerProjects.map((design) => (
                    <ProjectCard
                      key={design._id || design.slug}
                      design={design}
                    />
                  ))}
                </div>
              )}

            {!loading &&
              !error &&
              fullBleedProject && (
                <div className="mt-5">
                  <ProjectCard
                    design={fullBleedProject}
                    large
                  />
                </div>
              )}

            {!loading &&
              !error &&
              designs.length > 6 && (
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {designs.slice(6).map((design) => (
                    <ProjectCard
                      key={design._id || design.slug}
                      design={design}
                    />
                  ))}
                </div>
              )}

            {!loading &&
              !error &&
              designs.length > 0 && (
                <div className="mt-10 flex items-center justify-between border-t border-[#292820]/10 pt-5">
                  <span className="text-[9px] uppercase tracking-[0.24em] text-[#817a70]">
                    Design Collection
                  </span>

                  <span className="text-[9px] uppercase tracking-[0.24em] text-[#817a70]">
                    {designs.length} Projects
                  </span>
                </div>
              )}
          </div>
        </section>

        {/* =====================================================
            CONSULTATION CTA
        ===================================================== */}
        <section className="relative overflow-hidden bg-[#292820] px-5 py-20 text-[#f4f1eb] sm:px-8 sm:py-24 lg:px-12 lg:py-28">
          <div className="pointer-events-none absolute left-0 top-0 h-full w-full overflow-hidden">
            <div className="absolute -right-20 -top-32 h-72 w-72 rounded-full border border-[#d2b38d]/10" />

            <div className="absolute -right-8 -top-20 h-52 w-52 rounded-full border border-[#d2b38d]/10" />
          </div>

          <div className="relative mx-auto max-w-360">
            <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#d2b38d]" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.28em] text-[#d2b38d]">
                    Start Your Project
                  </span>
                </div>

                <h2 className="max-w-4xl font-serif text-[3rem] font-normal leading-[0.96] tracking-[-0.03em] sm:text-[4.4rem] lg:text-[5.8rem]">
                  Your space could{" "}
                  <em className="text-[#d2b38d]">
                    tell a story too.
                  </em>
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">
                  Tell us about your space, your lifestyle and the feeling
                  you want to create. We&apos;ll help shape the rest.
                </p>
              </div>

              <Link
                href="/consultation"
                className="group inline-flex w-fit items-center gap-5 border border-[#d2b38d]/70 px-7 py-4 text-[9px] font-semibold uppercase tracking-[0.22em] text-[#f4f1eb] transition-all duration-300 hover:bg-[#d2b38d] hover:text-[#292820]"
              >
                Book a Consultation

                <span className="text-base leading-none transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}