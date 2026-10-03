/* eslint-disable @next/next/no-img-element */

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { publicAboutApi, type About } from "@/lib/api";

function ImageBlock({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div
        className={`flex h-full min-h-65 items-center justify-center bg-[#e8dfcf] ${className}`}
      >
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#8a806f]">
          Image coming soon
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}

function SectionLabel({
  number,
  children,
  dark = false,
}: {
  number?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.25em] ${
        dark ? "text-[#d6b56b]" : "text-[#9a762f]"
      }`}
    >
      <span className="h-px w-5 bg-current" />
      {number && <span>{number}</span>}
      <span>{children}</span>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

export default function AboutPage() {
  const [about, setAbout] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAbout() {
      try {
        setLoading(true);
        setError("");

        const response = await publicAboutApi.getAbout();

        if (!mounted) return;

        if (!response.success || !response.data) {
          throw new Error(
            response.message || "Unable to load About content."
          );
        }

        setAbout(response.data);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load About content."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAbout();

    return () => {
      mounted = false;
    };
  }, []);

  const principles = useMemo(() => {
    return [...(about?.principles ?? [])].sort(
      (a, b) => a.order - b.order
    );
  }, [about]);

  const approach = useMemo(() => {
    return [...(about?.approach ?? [])].sort(
      (a, b) => a.order - b.order
    );
  }, [about]);

  if (loading) {
    return <AboutLoading />;
  }

  if (error || !about) {
    return (
      <main className="min-h-screen bg-[#fbf4e7] text-[#0b2a42]">
        <header className="fixed inset-x-0 top-0 z-100 border-b border-white/10 bg-[#08253a]">
          <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-6 md:px-10 lg:px-16">
            <Link href="/" className="text-white">
              <div className="font-serif text-xl tracking-[0.22em]">
                STUDIO
              </div>

              <div className="mt-0.5 text-[7px] uppercase tracking-[0.28em] text-[#d6b56b]">
                Interior Design
              </div>
            </Link>
          </div>
        </header>

        <section className="flex min-h-screen items-center justify-center px-6 pt-24">
          <div className="max-w-lg text-center">
            <SectionLabel>About the Studio</SectionLabel>

            <h1 className="mt-6 font-serif text-4xl leading-[0.98] md:text-6xl">
              Something went wrong.
            </h1>

            <p className="mt-6 text-sm leading-7 text-[#69727a]">
              {error || "The About content could not be loaded."}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-8 rounded-full bg-[#0b2f4a] px-7 py-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[#123d5d]"
            >
              Try Again <Arrow />
            </button>
          </div>
        </section>
      </main>
    );
  }

  const heroImage = about.hero.image;
  const storyImage = about.studioStory.image;
  const languageImages = about.designLanguage.images ?? [];

  return (
    <main className="min-h-screen overflow-hidden bg-[#fbf4e7] text-[#0b2a42]">
      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="fixed inset-x-0 top-0 z-100 border-b border-white/10 bg-[#08253a]">
        <div className="mx-auto flex h-18 max-w-[1600px] items-center justify-between px-6 md:px-10 lg:px-16">
          <Link href="/" className="shrink-0 text-white">
            <div className="font-serif text-[19px] tracking-[0.25em]">
              STUDIO
            </div>

            <div className="mt-0.5 text-[7px] uppercase tracking-[0.3em] text-[#d6b56b]">
              Interior Design
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {[
              ["Home", "/"],
              ["Designs", "/designs"],
              ["Services", "/services"],
              ["Projects", "/#portfolio"],
              ["About", "/about"],
              ["Contact", "/#contact"],
            ].map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={`relative text-[9px] font-medium uppercase tracking-[0.17em] transition ${
                  label === "About"
                    ? "text-white after:absolute after:-bottom-3 after:left-0 after:h-px after:w-full after:bg-[#c99c45]"
                    : "text-white/75 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link
            href="/consultation"
            className="hidden rounded-full bg-[#f7eddb] px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.15em] text-[#15344a] transition hover:bg-white md:inline-flex"
          >
            Book a Consultation <span className="ml-2">→</span>
          </Link>

          <Link
            href="/consultation"
            className="rounded-full bg-[#f7eddb] px-4 py-2.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-[#15344a] md:hidden"
          >
            Book
          </Link>
        </div>
      </header>

      {/* =========================================================
          HERO — ABOUT THE STUDIO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#fbf4e7] pt-18">
        <div className="mx-auto grid min-h-147.5 max-w-[1600px] items-center gap-12 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:px-16 lg:py-24">
          <div className="relative z-10 max-w-130">
            <SectionLabel>About the Studio</SectionLabel>

            <h1 className="mt-6 max-w-125 font-serif text-[48px] leading-[0.93] tracking-tight text-[#0b2f4a] sm:text-[58px] md:text-[68px] lg:text-[76px]">
              {about.hero.title}
            </h1>

            <p className="mt-7 max-w-120 text-[14px] leading-7 text-[#66717a] md:text-[15px]">
              {about.hero.subtitle}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/consultation"
                className="rounded-full bg-[#0b3855] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#124766]"
              >
                Start a Conversation <Arrow />
              </Link>

              <Link
                href="/designs"
                className="rounded-full border border-[#cfc3af] px-6 py-3.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#17364c] transition hover:border-[#9d8869] hover:bg-white/50"
              >
                Explore Our Designs
              </Link>
            </div>
          </div>

          {/* Asymmetric hero composition */}
          <div className="relative min-h-97.5 md:min-h-125 lg:min-h-140">
            <div className="absolute right-0 top-0 h-[78%] w-[82%] overflow-hidden rounded-tl-[3px] rounded-br-[100px] md:w-[80%]">
              <ImageBlock
                src={heroImage}
                alt={about.hero.title}
                priority
              />
            </div>

            {storyImage && (
              <>
                <div className="absolute bottom-[2%] left-[3%] z-20 h-[38%] w-[30%] overflow-hidden rounded-[3px] border-[5px] border-[#fbf4e7] shadow-[0_18px_50px_rgba(21,39,50,0.16)]">
                  <ImageBlock
                    src={storyImage}
                    alt={about.studioStory.title}
                  />
                </div>

                <div className="absolute bottom-[9%] right-[1%] z-30 h-[38%] w-[25%] overflow-hidden rounded-[3px] border-[5px] border-[#fbf4e7] shadow-[0_18px_50px_rgba(21,39,50,0.14)]">
                  <ImageBlock
                    src={storyImage}
                    alt={about.studioStory.title}
                  />
                </div>
              </>
            )}

            <div className="absolute left-[12%] top-[12%] h-px w-20 bg-[#c89d4b]/70" />
          </div>
        </div>
      </section>

      {/* =========================================================
          01 — OUR STORY
      ========================================================= */}
      <section className="bg-[#fffaf1]">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:gap-20 lg:px-16 lg:py-24">
          <div className="max-w-130">
            <SectionLabel number="01">Our Story</SectionLabel>

            <h2 className="mt-5 font-serif text-[38px] leading-[1.02] tracking-[-0.02em] text-[#0b2f4a] md:text-[50px]">
              {about.studioStory.title}
            </h2>

            <div className="mt-6 max-w-125 whitespace-pre-line text-[14px] leading-7 text-[#68737b] md:text-[15px]">
              {about.studioStory.description}
            </div>
          </div>

          <div className="relative h-82.5 overflow-hidden md:h-117.5 lg:h-130">
            <ImageBlock
              src={storyImage}
              alt={about.studioStory.title}
            />

            <div className="pointer-events-none absolute inset-0 border border-[#d9ccb8]/50" />
          </div>
        </div>
      </section>

      {/* =========================================================
          02 — DESIGN PHILOSOPHY
      ========================================================= */}
      <section className="bg-[#08253a] text-white">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-6 py-16 md:px-10 md:py-20 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-16 lg:py-24">
          <div className="max-w-125">
            <SectionLabel number="02" dark>
              Design Philosophy
            </SectionLabel>

            <h2 className="mt-5 font-serif text-[40px] leading-[0.98] tracking-[-0.02em] text-[#fffaf1] md:text-[54px]">
              {about.philosophy.title}
            </h2>

            <p className="mt-6 whitespace-pre-line text-[14px] leading-7 text-white/65 md:text-[15px]">
              {about.philosophy.description}
            </p>

            {principles.length > 0 && (
              <div className="mt-8 grid grid-cols-1 border-t border-white/20 sm:grid-cols-3">
                {principles.slice(0, 3).map((item) => (
                  <div
                    key={`${item.order}-${item.title}`}
                    className="border-b border-white/20 py-4 sm:border-b-0 sm:border-r sm:px-5 sm:first:pl-0 sm:last:border-r-0"
                  >
                    <div className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#e0c079]">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative h-80 overflow-hidden md:h-117.5">
            <ImageBlock
              src={languageImages[0]}
              alt={about.designLanguage.title}
            />

            <div className="absolute inset-0 bg-linear-to-tr from-[#08253a]/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* =========================================================
          03 — PRINCIPLES / WHY WORK WITH US
      ========================================================= */}
      <section className="bg-[#fbf4e7]">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <SectionLabel number="03">
                Why Work With Us
              </SectionLabel>

              <h2 className="mt-5 max-w-112.5 font-serif text-[40px] leading-none tracking-[-0.02em] text-[#0b2f4a] md:text-[52px]">
                A design process built around you.
              </h2>

              <p className="mt-6 max-w-110 text-[14px] leading-7 text-[#69737a]">
                Thoughtful design begins with understanding how you live,
                what matters to you, and how your space should feel.
              </p>
            </div>

            <div className="grid border-t border-[#d7cbb9]">
              {principles.map((item, index) => (
                <article
                  key={`${item.order}-${item.title}`}
                  className="grid gap-5 border-b border-[#d7cbb9] py-7 md:grid-cols-[80px_1fr_1.5fr] md:items-start"
                >
                  <div className="font-serif text-2xl text-[#b28a42]">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="font-serif text-[25px] leading-tight text-[#0b2f4a]">
                    {item.title}
                  </h3>

                  <p className="text-[13px] leading-6 text-[#6c767d]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          04 — HOW WE WORK
      ========================================================= */}
      <section className="bg-[#fffaf1]">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <SectionLabel number="04">How We Work</SectionLabel>

              <h2 className="mt-5 max-w-107.5 font-serif text-[39px] leading-none tracking-[-0.02em] text-[#0b2f4a] md:text-[51px]">
                From first conversation to final detail.
              </h2>

              <p className="mt-6 max-w-107.5 text-[14px] leading-7 text-[#68737b]">
                A considered process keeps every project clear,
                personal and intentional.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-5 right-5 top-5.5 hidden h-px bg-[#d6c9b6] md:block" />

              <div className="grid gap-8 md:grid-cols-5">
                {approach.map((item, index) => (
                  <article
                    key={`${item.order}-${item.title}`}
                    className="relative"
                  >
                    <div className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-[#c99a40] bg-[#fffaf1] font-serif text-sm text-[#0b2f4a]">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3 className="mt-5 font-serif text-[22px] leading-tight text-[#0b2f4a]">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-[12px] leading-5 text-[#707a80]">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          05 — DESIGN LANGUAGE
      ========================================================= */}
      <section className="bg-[#fbf4e7]">
        <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-10 md:py-20 lg:px-16 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
            <div>
              <SectionLabel number="05">
                Materials & Expertise
              </SectionLabel>

              <h2 className="mt-5 max-w-120 font-serif text-[39px] leading-none text-[#0b2f4a] md:text-[51px]">
                {about.designLanguage.title}
              </h2>

              <p className="mt-6 max-w-125 whitespace-pre-line text-[14px] leading-7 text-[#69737a]">
                {about.designLanguage.description}
              </p>
            </div>

            {languageImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {languageImages.slice(0, 6).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className={`overflow-hidden ${
                      index === 0
                        ? "col-span-2 row-span-2 h-85 md:h-110"
                        : "h-41.25 md:h-53.75"
                    }`}
                  >
                    <ImageBlock
                      src={image}
                      alt={`${about.designLanguage.title} ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex min-h-87.5 items-center justify-center border border-[#d8ccb9]">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8b8173]">
                  Design language imagery coming soon
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================================================
          DESIGN LANGUAGE IMAGE STRIP
      ========================================================= */}
      {languageImages.length > 3 && (
        <section className="bg-[#fffaf1]">
          <div className="mx-auto grid max-w-[1600px] grid-cols-2 gap-2 px-3 py-3 md:grid-cols-4 md:px-6">
            {languageImages.slice(0, 4).map((image, index) => (
              <div
                key={`${image}-strip-${index}`}
                className="h-45 md:h-65"
              >
                <ImageBlock
                  src={image}
                  alt={`${about.designLanguage.title} detail ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#08253a]">
        <div className="absolute inset-0">
          {languageImages[languageImages.length - 1] && (
            <img
              src={languageImages[languageImages.length - 1]}
              alt=""
              className="h-full w-full object-cover opacity-35"
            />
          )}

          <div className="absolute inset-0 bg-[#08253a]/75" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-6 py-20 md:px-10 md:py-28 lg:px-16 lg:py-32">
          <div className="max-w-170">
            <SectionLabel dark>Let&apos;s Create</SectionLabel>

            <h2 className="mt-5 font-serif text-[46px] leading-[0.95] tracking-[-0.02em] text-[#fffaf1] md:text-[65px] lg:text-[76px]">
              {about.cta.title}
            </h2>

            <p className="mt-6 max-w-130 text-[14px] leading-7 text-white/65 md:text-[15px]">
              {about.cta.description}
            </p>

            <Link
              href="/consultation"
              className="mt-8 inline-flex items-center rounded-full bg-[#f7eddb] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#12344b] transition hover:bg-white"
            >
              {about.cta.buttonText || "Book a Consultation"}{" "}
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function AboutLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-[#fbf4e7]">
      <div className="h-18 bg-[#08253a]" />

      <section className="grid min-h-147.5 items-center gap-10 px-6 py-16 md:px-10 lg:grid-cols-2 lg:px-16">
        <div>
          <div className="h-3 w-32 rounded bg-[#ddd1bd]" />

          <div className="mt-7 h-24 max-w-125 rounded bg-[#ded2bf]" />

          <div className="mt-5 h-20 max-w-115 rounded bg-[#e6dac7]" />

          <div className="mt-8 h-12 w-56 rounded-full bg-[#d8ccb9]" />
        </div>

        <div className="h-110 bg-[#e2d6c3]" />
      </section>

      <section className="grid gap-10 px-6 py-20 md:px-10 lg:grid-cols-2 lg:px-16">
        <div>
          <div className="h-3 w-28 rounded bg-[#ddd1bd]" />

          <div className="mt-6 h-16 max-w-110 rounded bg-[#ded2bf]" />

          <div className="mt-5 h-28 max-w-125 rounded bg-[#e6dac7]" />
        </div>

        <div className="h-100 bg-[#e2d6c3]" />
      </section>

      <section className="min-h-105 bg-[#08253a]" />
    </main>
  );
}