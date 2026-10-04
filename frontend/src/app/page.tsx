"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import {
  publicTestimonialApi,
  type Testimonial,
} from "@/lib/api";

/* =========================================================
   HERO IMAGES
========================================================= */

const heroSlides = [
  {
    src: "/images/home-tour/living-room.jpg",
    alt: "Contemporary living room interior",
  },
  {
    src: "/images/home-tour/kitchen.jpg",
    alt: "Contemporary kitchen interior",
  },
  {
    src: "/images/home-tour/bedroom.jpg",
    alt: "Contemporary bedroom interior",
  },
  {
    src: "/images/home-tour/detail.jpg",
    alt: "Interior material and architectural detail",
  },
];

/* =========================================================
   SERVICES
========================================================= */

const services = [
  {
    number: "01",
    title: "Residential Interiors",
    slug: "residential-interiors",
    text: "Complete interior design for homes shaped around your lifestyle, personality and everyday rituals.",
    image: "/images/home-tour/living-room.jpg",
  },
  {
    number: "02",
    title: "Space Planning",
    slug: "space-planning",
    text: "Thoughtful layouts that improve movement, functionality, proportion and the feeling of a room.",
    image: "/images/home-tour/kitchen.jpg",
  },
  {
    number: "03",
    title: "Material & Styling",
    slug: "material-styling",
    text: "A considered combination of materials, furniture, lighting, textures and finishing details.",
    image: "/images/home-tour/detail.jpg",
  },
  {
    number: "04",
    title: "Turnkey Execution",
    slug: "turnkey-execution",
    text: "From concept and drawings through execution, coordination and final handover.",
    image: "/images/home-tour/bedroom.jpg",
  },
];

/* =========================================================
   NAVIGATION
========================================================= */

const navItems = [
  { label: "Home", href: "/" },
  { label: "Designs", href: "/designs" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#portfolio" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "#reviews" },
  { label: "Contact", href: "#contact" },
];

/* =========================================================
   CONTACT DETAILS
========================================================= */

const CONTACT_DETAILS = {
  locationLabel: "Delhi NCR, India",
  locationUrl:
    "https://www.google.com/maps/search/?api=1&query=Delhi+NCR+India",
  email: "hello@interiorstudio.com",
  phone: "+919999999999",
  phoneDisplay: "+91 99999 99999",

  // WhatsApp number.
  // Keep country code and numbers only for the wa.me URL.
  whatsapp: "+919999999999",

  instagram: "https://www.instagram.com/",
};

/* =========================================================
   PROJECT
========================================================= */

const PROJECT_BEFORE_IMAGE =
  "/images/projects/project-before.jpg";

const PROJECT_AFTER_IMAGE =
  "/images/projects/project-after.jpg";

type StaticProject = {
  _id: string;
  title: string;
  location: string;
  category: string;
  style: string;
  description: string;
};

/* =========================================================
   PAGE
========================================================= */

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [testimonials, setTestimonials] = useState<
    Testimonial[]
  >([]);

  const [testimonialsLoading, setTestimonialsLoading] =
    useState(true);

  const [testimonialsError, setTestimonialsError] =
    useState(false);

  /* -------------------------------------------------------
     HERO AUTOPLAY
  ------------------------------------------------------- */

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentSlide(
        (previous) => (previous + 1) % heroSlides.length
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  /* -------------------------------------------------------
     LOAD PUBLIC TESTIMONIALS
  ------------------------------------------------------- */

  useEffect(() => {
    let isMounted = true;

    const loadTestimonials = async () => {
      try {
        setTestimonialsLoading(true);
        setTestimonialsError(false);

        const response =
          await publicTestimonialApi.getTestimonials();

        if (!isMounted) return;

        if (response.success && response.data) {
          /*
           * publicTestimonialApi.getTestimonials()
           * returns Testimonial[] directly.
           */
          setTestimonials(response.data);
        } else {
          setTestimonials([]);
          setTestimonialsError(true);
        }
      } catch (error) {
        console.error(
          "Failed to load testimonials:",
          error
        );

        if (!isMounted) return;

        setTestimonials([]);
        setTestimonialsError(true);
      } finally {
        if (isMounted) {
          setTestimonialsLoading(false);
        }
      }
    };

    loadTestimonials();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f4f1eb] text-[#292820]">
      {/* ===================================================
          NAVBAR
      =================================================== */}

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#151510]/70 backdrop-blur-xl">
        <div className="mx-auto flex h-19 w-full max-w-1600 items-center justify-between px-6 sm:px-8 lg:px-12 xl:px-16">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Interior Design Studio home"
          >
            <span className="flex h-9 w-9 items-center justify-center border border-white/40 text-white">
              <span className="font-serif text-lg">
                I
              </span>
            </span>

            <span className="hidden text-[10px] font-medium uppercase tracking-[0.28em] text-white sm:block">
              Interior
              <br />
              Studio
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-[10px] uppercase tracking-[0.2em] text-white/75 transition-colors duration-300 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/consultation"
              className="hidden border border-white/60 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-[#292820] sm:inline-flex"
            >
              Schedule Appointment
            </Link>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="hidden text-[9px] uppercase tracking-[0.2em] text-white/75 transition hover:text-white md:block"
                >
                  Sign In
                </button>
              </SignInButton>

              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="hidden text-[9px] uppercase tracking-[0.2em] text-white/75 transition hover:text-white md:block"
                >
                  Sign Up
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>

            <button
              type="button"
              aria-label="Open navigation menu"
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 lg:hidden"
            >
              <span className="h-px w-5 bg-white" />
              <span className="h-px w-5 bg-white" />
            </button>
          </div>
        </div>
      </header>

      {/* ===================================================
          HOME / HERO
      =================================================== */}

      <section
        id="home"
        className="relative h-svh min-h-170 w-full overflow-hidden bg-[#272720]"
      >
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => {
            const isActive = index === currentSlide;

            return (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isActive
                    ? "z-10 opacity-100"
                    : "z-0 opacity-0"
                }`}
                aria-hidden={!isActive}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  className="h-full w-full object-cover object-center"
                  loading="eager"
                />
              </div>
            );
          })}
        </div>

        <div className="absolute inset-0 z-20 bg-black/10" />

        <div className="absolute inset-0 z-20 bg-linear-to-r from-black/65 via-black/25 to-transparent" />

        <div className="absolute inset-0 z-20 bg-linear-to-t from-black/45 via-transparent to-black/10" />

        <div className="absolute inset-0 z-30 flex items-center">
          <div className="mx-auto w-full max-w-1600 px-6 sm:px-10 md:px-14 lg:px-20 xl:px-24">
            <div className="max-w-162.5">
              <div className="mb-7 flex items-center gap-4">
                <span className="h-px w-10 bg-[#d3b18c]" />

                <p className="text-[9px] font-medium uppercase tracking-[0.34em] text-white/85 sm:text-[10px]">
                  Interior Design Studio
                </p>
              </div>

              <h1 className="font-serif text-[58px] font-normal leading-[0.88] tracking-[-0.045em] text-white sm:text-[72px] md:text-[82px] lg:text-[96px] xl:text-[108px]">
                <span className="block">
                  Spaces
                </span>

                <span
                  className="block py-1 font-normal italic text-[#dec4a6]"
                  style={{
                    fontFamily:
                      '"Snell Roundhand", "Segoe Script", "Brush Script MT", cursive',
                    letterSpacing: "-0.035em",
                    fontWeight: 400,
                  }}
                >
                  That Feel
                </span>

                <span className="block">
                  Like You.
                </span>
              </h1>

              <p className="mt-8 max-w-125 text-[13px] leading-7 text-white/80 sm:text-[14px] sm:leading-8">
                We design considered homes around the way
                you live — from the first layout to the final
                detail.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-7">
                <Link
                  href="/designs"
                  className="group inline-flex items-center gap-6 bg-white px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-[#292820] transition-all duration-300 hover:bg-[#d4b795]"
                >
                  <span>Explore Designs</span>

                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/consultation"
                  className="group inline-flex items-center gap-3 border-b border-white/60 pb-2 text-[9px] font-medium uppercase tracking-[0.22em] text-white transition-all duration-300 hover:border-[#d4b795]"
                >
                  <span>
                    Schedule an Appointment
                  </span>

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {heroSlides.map((slide, index) => (
            <span
              key={slide.src}
              className={`h-px transition-all duration-500 ${
                index === currentSlide
                  ? "w-10 bg-white"
                  : "w-4 bg-white/40"
              }`}
            />
          ))}
        </div>
      </section>

      {/* ===================================================
          SERVICES
      =================================================== */}

      <section
        id="services"
        className="relative scroll-mt-20 overflow-hidden bg-[#1d1d18] text-white"
      >
        <div className="pointer-events-none absolute -left-40 top-1/3 h-100 w-100 rounded-full bg-[#9d8062]/10 blur-[120px]" />

        <div className="pointer-events-none absolute -right-40 bottom-0 h-100 w-100 rounded-full bg-[#c7a986]/5 blur-[120px]" />

        <div className="relative mx-auto max-w-375 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-[#c7a986]" />

                <p className="text-[9px] uppercase tracking-[0.32em] text-[#c7a986]">
                  What We Do
                </p>
              </div>

              <h2 className="max-w-160 font-serif text-4xl font-normal leading-[0.94] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                Design that
                <br />
                feels{" "}
                <span
                  className="italic text-[#d4b99a]"
                  style={{
                    fontFamily:
                      '"Snell Roundhand", "Segoe Script", "Brush Script MT", cursive',
                  }}
                >
                  personal.
                </span>
              </h2>
            </div>

            <div className="max-w-lg lg:justify-self-end">
              <p className="text-[13px] leading-6 text-white/55 sm:text-sm sm:leading-7">
                From concept to completion, our services are
                tailored to create interiors that feel
                considered, personal and lasting.
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.18fr_0.82fr] lg:gap-12">
            <div className="relative min-h-120 overflow-hidden bg-[#302f28] sm:min-h-145 lg:min-h-170">
              {heroSlides.map((slide, index) => {
                const isActive = index === currentSlide;

                return (
                  <div
                    key={slide.src}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      isActive
                        ? "z-10 opacity-100"
                        : "z-0 opacity-0"
                    }`}
                  >
                    <img
                      src={slide.src}
                      alt={slide.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                );
              })}

              <div className="absolute inset-0 z-20 bg-linear-to-t from-black/75 via-black/10 to-black/10" />

              <div className="absolute bottom-0 left-0 z-30 w-full p-7 sm:p-9 lg:p-11">
                <div className="flex items-end justify-between gap-6">
                  <div className="max-w-xl">
                    <div className="mb-5 flex items-center gap-4">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-white/55">
                        {String(
                          currentSlide + 1
                        ).padStart(2, "0")}{" "}
                        /{" "}
                        {String(
                          heroSlides.length
                        ).padStart(2, "0")}
                      </span>

                      <span className="h-px w-8 bg-white/40" />

                      <span className="text-[9px] uppercase tracking-[0.25em] text-white/55">
                        Featured Space
                      </span>
                    </div>

                    <h3 className="font-serif text-3xl leading-none sm:text-4xl lg:text-5xl">
                      {services[currentSlide].title}
                    </h3>

                    <p className="mt-4 max-w-xl text-xs leading-6 text-white/65 sm:text-sm sm:leading-7">
                      {services[currentSlide].text}
                    </p>
                  </div>

                  <button
                    type="button"
                    aria-label="Next service image"
                    onClick={() =>
                      setCurrentSlide(
                        (previous) =>
                          (previous + 1) %
                          heroSlides.length
                      )
                    }
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/40 text-lg text-white transition hover:border-white hover:bg-white hover:text-[#292820]"
                  >
                    →
                  </button>
                </div>
              </div>

              <div className="absolute bottom-7 right-7 z-30 flex gap-2 sm:bottom-9 sm:right-9">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.src}
                    type="button"
                    aria-label={`Show slide ${
                      index + 1
                    }`}
                    onClick={() =>
                      setCurrentSlide(index)
                    }
                    className={`h-px transition-all duration-500 ${
                      currentSlide === index
                        ? "w-9 bg-white"
                        : "w-4 bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col">
              <div className="border-t border-white/15">
                {services.map((service, index) => {
                  const isActive =
                    currentSlide === index;

                  return (
                    <div
                      key={service.number}
                      className={`group border-b border-white/15 transition-all duration-500 ${
                        isActive
                          ? "bg-white/[0.035]"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-5 py-6 sm:gap-6 sm:py-7">
                        <span
                          className={`h-20 w-px shrink-0 transition-all duration-500 ${
                            isActive
                              ? "bg-[#c7a986]"
                              : "bg-transparent"
                          }`}
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentSlide(index)
                          }
                          aria-label={`Show ${service.title}`}
                          className="relative h-20 w-24 shrink-0 overflow-hidden bg-[#302f28] sm:h-22 sm:w-28"
                        >
                          <img
                            src={service.image}
                            alt=""
                            className={`h-full w-full object-cover transition duration-700 ${
                              isActive
                                ? "scale-105"
                                : "scale-100 opacity-65 group-hover:scale-105 group-hover:opacity-100"
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentSlide(index)
                          }
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="mb-2 flex items-center gap-3">
                            <span className="text-[9px] uppercase tracking-[0.25em] text-[#c7a986]">
                              {service.number}
                            </span>
                          </div>

                          <h3
                            className={`font-serif text-xl transition-colors sm:text-2xl ${
                              isActive
                                ? "text-white"
                                : "text-white/80 group-hover:text-white"
                            }`}
                          >
                            {service.title}
                          </h3>

                          <p className="mt-2 max-w-md text-xs leading-5 text-white/45 sm:text-[13px] sm:leading-6">
                            {service.text}
                          </p>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setCurrentSlide(index)
                          }
                          aria-label={`View ${service.title}`}
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm transition-all duration-300 ${
                            isActive
                              ? "border-white/60 text-white"
                              : "border-white/15 text-white/45 group-hover:border-white/40 group-hover:text-white"
                          }`}
                        >
                          →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-8">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-6 bg-[#e8dcc8] px-7 py-4 text-[9px] font-medium uppercase tracking-[0.25em] text-[#292820] transition-all duration-300 hover:bg-white"
                >
                  <span>Explore Services</span>

                  <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          PORTFOLIO / PROJECTS
      =================================================== */}

      <section
        id="portfolio"
        className="bg-[#f4f1eb] px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-24"
      >
        <div className="mx-auto max-w-375">
          <div className="mb-10 lg:mb-12">
            <p className="mb-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-[#9d8062]">
              <span className="h-px w-8 bg-[#9d8062]" />
              Selected Work
            </p>

            <h2 className="max-w-225 font-serif text-5xl font-normal leading-[0.9] tracking-[-0.045em] text-[#292820] sm:text-6xl lg:text-7xl">
              Spaces transformed{" "}
              <span className="italic text-[#9d8062]">
                with intention.
              </span>
            </h2>
          </div>

          <StaticProjectShowcase />
        </div>
      </section>

      {/* ===================================================
          CLIENT STORIES / TESTIMONIALS
      =================================================== */}

      <section
        id="reviews"
        className="scroll-mt-24 bg-[#e7e1d6]"
      >
        <div className="mx-auto max-w-375 px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="mb-12 flex flex-col justify-between gap-8 lg:mb-16 lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[9px] uppercase tracking-[0.32em] text-[#9d8062]">
                <span className="h-px w-8 bg-[#9d8062]" />
                Client Stories
              </p>

              <h2 className="max-w-190 font-serif text-5xl font-normal leading-[0.92] tracking-[-0.045em] text-[#292820] sm:text-6xl lg:text-7xl">
                Spaces are personal.
                <br />
                <span className="italic text-[#9d8062]">
                  So are the stories.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#292820]/55 lg:pb-2">
              Every project begins with understanding how
              our clients live, what matters to them and how
              they want their space to feel.
            </p>
          </div>

          {testimonialsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="min-h-70 animate-pulse border border-[#292820]/10 bg-[#f4f1eb]/50 p-7 sm:p-8"
                >
                  <div className="h-3 w-20 bg-[#292820]/10" />

                  <div className="mt-8 space-y-3">
                    <div className="h-3 w-full bg-[#292820]/10" />
                    <div className="h-3 w-11/12 bg-[#292820]/10" />
                    <div className="h-3 w-4/5 bg-[#292820]/10" />
                  </div>

                  <div className="mt-10 h-3 w-28 bg-[#292820]/10" />
                </div>
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="border border-[#292820]/10 bg-[#f4f1eb]/50 px-6 py-16 text-center">
              <p className="font-serif text-3xl text-[#292820]/60">
                {testimonialsError
                  ? "Client stories are temporarily unavailable."
                  : "Our client stories will appear here soon."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  key={testimonial._id}
                  className="group relative flex min-h-75 flex-col justify-between border border-[#292820]/10 bg-[#f4f1eb] p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(41,40,32,0.08)] sm:p-8"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-serif text-4xl leading-none text-[#9d8062]/35">
                        “
                      </span>

                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map(
                          (_, index) => (
                            <span
                              key={index}
                              className={
                                index < testimonial.rating
                                  ? "text-[#9d8062]"
                                  : "text-[#292820]/15"
                              }
                            >
                              ★
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <p className="mt-6 font-serif text-xl leading-[1.45] text-[#292820] sm:text-2xl">
                      {testimonial.message}
                    </p>
                  </div>

                  <div className="mt-10 flex items-center gap-4 border-t border-[#292820]/10 pt-6">
                    {testimonial.imageUrl ? (
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full bg-[#d8d0c4]">
                        <img
                          src={testimonial.imageUrl}
                          alt={testimonial.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#292820] font-serif text-sm text-white">
                        {testimonial.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-medium uppercase tracking-[0.2em] text-[#292820]">
                        {testimonial.name}
                      </p>

                      {testimonial.role && (
                        <p className="mt-1 truncate text-xs text-[#292820]/45">
                          {testimonial.role}
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {testimonials.length > 0 && (
            <div className="mt-12 flex justify-center lg:mt-14">
              <Link
                href="/consultation"
                className="group inline-flex items-center gap-6 border-b border-[#292820]/30 pb-2 text-[9px] font-medium uppercase tracking-[0.22em] text-[#292820] transition-all duration-300 hover:border-[#9d8062]"
              >
                <span>
                  Start Your Design Journey
                </span>

                <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ===================================================
          CONTACT / CONSULTATION
      =================================================== */}

      <section
        id="contact"
        className="scroll-mt-20 border-t border-white/10 bg-[#151510] text-white"
      >
        <div className="mx-auto max-w-375 px-6 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-20">
          <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.05fr_0.9fr_1fr] lg:items-end lg:gap-14">
            {/* HEADING */}

            <div>
              <div className="mb-5 flex items-center gap-3">
                <span className="h-px w-8 bg-[#c7a986]" />

                <p className="text-[9px] font-medium uppercase tracking-[0.32em] text-[#c7a986]">
                  Contact Studio
                </p>
              </div>

              <h2 className="max-w-xl font-serif text-5xl font-normal leading-[0.88] tracking-tighter sm:text-6xl lg:text-7xl">
                Let&apos;s create
                <br />
                something{" "}
                <span
                  className="italic text-[#c7a986]"
                  style={{
                    fontFamily:
                      '"Snell Roundhand", "Segoe Script", "Brush Script MT", cursive',
                  }}
                >
                  personal.
                </span>
              </h2>
            </div>

            {/* DESCRIPTION + CTA */}

            <div className="lg:pb-1">
              <p className="max-w-md text-sm leading-7 text-white/50">
                Have a home, space or project in mind?
                Tell us a little about it and our design
                team will help you take the next step.
              </p>

              <Link
                href="/consultation"
                className="group mt-7 inline-flex items-center gap-5 bg-[#e8dcc8] px-6 py-3.5 text-[9px] font-medium uppercase tracking-[0.22em] text-[#292820] transition-all duration-300 hover:bg-white"
              >
                <span>
                  Schedule an Appointment
                </span>

                <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>

            {/* REAL MAP */}

            <a
              href={CONTACT_DETAILS.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block h-56 overflow-hidden border border-white/15 bg-[#292922] sm:h-64 lg:h-60"
            >
              <iframe
                title="Interior Studio location - Delhi NCR"
                src="https://www.google.com/maps?q=Delhi+NCR+India&output=embed"
                className="pointer-events-none absolute inset-0 h-full w-full border-0 grayscale-[0.25] opacity-85 transition duration-500 group-hover:opacity-100"
                loading="lazy"
              />

              <div className="pointer-events-none absolute inset-0 bg-[#151510]/5 transition group-hover:bg-transparent" />

              <div className="absolute left-4 top-4 z-10 bg-[#151510]/90 px-3 py-2 backdrop-blur-sm">
                <p className="text-[8px] uppercase tracking-[0.22em] text-white">
                  Studio Location
                </p>
              </div>

              <div className="absolute bottom-4 right-4 z-10">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f4f1eb] text-sm text-[#292820] shadow-lg transition-all duration-300 group-hover:bg-[#c7a986] group-hover:text-white">
                  ↗
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <footer className="border-t border-white/10 bg-[#151510] text-white">
        <div className="mx-auto max-w-375 px-6 py-12 sm:px-10 lg:px-16 lg:py-14">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.85fr_1fr]">
            {/* BRAND */}

            <div>
              <Link
                href="/"
                className="inline-flex items-center gap-3"
              >
                <span className="flex h-10 w-10 items-center justify-center border border-white/35 font-serif text-lg">
                  I
                </span>

                <div className="text-[10px] uppercase tracking-[0.25em]">
                  Interior
                  <br />
                  Studio
                </div>
              </Link>

              <p className="mt-5 max-w-70 text-xs leading-6 text-white/35">
                Thoughtfully designed interiors shaped around
                the way you live.
              </p>

              <a
                href={CONTACT_DETAILS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
              >
                Instagram
                <span>↗</span>
              </a>
            </div>

            {/* NAVIGATE */}

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                Navigate
              </p>

              <div className="mt-5 flex flex-col gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="w-fit text-[9px] uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* SERVICES */}

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                Services
              </p>

              <div className="mt-5 flex flex-col gap-3">
                {services.map((service) => (
                  <Link
                    key={service.number}
                    href={`/services/${service.slug}`}
                    className="w-fit text-[9px] uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-white"
                  >
                    {service.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* CONTACT */}

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                Reach Us
              </p>

              <div className="mt-5 flex flex-col gap-3 text-xs leading-5 text-white/45">
                <a
                  href={CONTACT_DETAILS.locationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-white"
                >
                  {CONTACT_DETAILS.locationLabel}
                </a>

                <a
                  href={`mailto:${CONTACT_DETAILS.email}`}
                  className="transition hover:text-white"
                >
                  {CONTACT_DETAILS.email}
                </a>

                <a
                  href={`tel:${CONTACT_DETAILS.phone}`}
                  className="transition hover:text-white"
                >
                  {CONTACT_DETAILS.phoneDisplay}
                </a>
              </div>

              <Link
                href="/consultation"
                className="mt-6 inline-flex items-center gap-4 border border-white/20 px-5 py-3 text-[9px] uppercase tracking-[0.2em] text-white/65 transition hover:border-white hover:bg-white hover:text-[#292820]"
              >
                Schedule Appointment
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* FOOTER BOTTOM */}

          <div className="mt-12 flex flex-col justify-between gap-4 border-t border-white/10 pt-5 text-[8px] uppercase tracking-[0.18em] text-white/20 sm:flex-row sm:items-center">
            <p>
              © {new Date().getFullYear()} Interior Studio
            </p>

            <div className="flex gap-5">
              <span>Delhi NCR</span>
              <span>India</span>
            </div>

            <div className="flex items-center gap-5">
              <Link
                href="/admin/login"
                className="transition-colors hover:text-white"
              >
                Studio Login
              </Link>

              <p>Designed with intention.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================================================
          FLOATING WHATSAPP BUTTON
          DIRECTLY OPENS WHATSAPP
      =================================================== */}

      <a
        href={`https://wa.me/${CONTACT_DETAILS.whatsapp.replace(
          /\D/g,
          ""
        )}?text=${encodeURIComponent(
          "Hi, I would like to discuss an interior design project."
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-60 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] sm:bottom-8 sm:right-8"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.52 3.48A11.83 11.83 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.59 5.93L.1 24l6.33-1.66a11.9 11.9 0 0 0 5.65 1.43h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.23-6.15-3.45-8.41ZM12.09 21.72h-.01a9.84 9.84 0 0 1-5.02-1.37l-.36-.21-3.76.99 1-3.67-.23-.38a9.82 9.82 0 0 1-1.5-5.2C2.21 6.45 6.64 2.02 12.08 2.02c2.64 0 5.12 1.03 6.98 2.9a9.82 9.82 0 0 1 2.89 6.98c0 5.44-4.43 9.87-9.86 9.87Zm5.41-7.39c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.67-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </main>
  );
}

/* =========================================================
   PROJECT SHOWCASE
========================================================= */

function StaticProjectShowcase() {
  const staticProject: StaticProject = {
    _id: "static-project",
    title: "Modern Comfort, Timeless Living",
    location: "Residential",
    category: "Living Room",
    style: "Contemporary",
    description:
      "A thoughtful transformation from an unfinished space into a warm, elegant interior designed for everyday living.",
  };

  return (
    <ProjectComparison
      project={staticProject}
      beforeImage={PROJECT_BEFORE_IMAGE}
      afterImage={PROJECT_AFTER_IMAGE}
    />
  );
}

/* =========================================================
   PROJECT COMPARISON
========================================================= */

function ProjectComparison({
  project,
  beforeImage,
  afterImage,
}: {
  project: StaticProject;
  beforeImage: string;
  afterImage: string;
}) {
  const [sliderPosition, setSliderPosition] =
    useState(50);

  const [isDragging, setIsDragging] =
    useState(false);

  const updateSlider = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    if (!rect.width) return;

    const position =
      ((event.clientX - rect.left) / rect.width) *
      100;

    setSliderPosition(
      Math.min(100, Math.max(0, position))
    );
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(true);

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    updateSlider(event);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (!isDragging) return;

    updateSlider(event);
  };

  const handlePointerUp = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    setIsDragging(false);

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  };

  return (
    <article className="grid gap-10 lg:grid-cols-[minmax(0,1.62fr)_minmax(320px,0.78fr)] lg:items-center lg:gap-12 xl:grid-cols-[minmax(0,1.68fr)_minmax(360px,0.76fr)] xl:gap-16">
      <div
        className={`relative aspect-[1.68/1] w-full touch-none select-none overflow-hidden rounded-3xl border border-[#d8d0c4] bg-[#ded7cb] shadow-[0_22px_55px_rgba(41,40,32,0.10)] sm:rounded-4xl ${
          isDragging
            ? "cursor-grabbing"
            : "cursor-ew-resize"
        }`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <img
          src={afterImage}
          alt={`${project.title} after transformation`}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            clipPath: `inset(0 ${
              100 - sliderPosition
            }% 0 0)`,
          }}
        >
          <img
            src={beforeImage}
            alt={`${project.title} before transformation`}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </div>

        <div className="absolute left-5 top-5 z-20 rounded-full bg-[#151510]/90 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.26em] text-white sm:left-7 sm:top-7">
          Before
        </div>

        <div className="absolute right-5 top-5 z-20 rounded-full bg-white/95 px-5 py-2.5 text-[9px] font-semibold uppercase tracking-[0.26em] text-[#292820] shadow-sm sm:right-7 sm:top-7">
          After
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#151510]/90 via-[#151510]/35 to-transparent" />

          <div className="relative px-6 pb-6 pt-20 sm:px-8 sm:pb-8">
            <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#d3b18c]">
              {project.category ||
                "Interior Design"}
            </p>

            <h3
              className="mt-2 max-w-2xl text-[clamp(2rem,3.4vw,3.6rem)] font-normal leading-[0.9] text-white"
              style={{
                fontFamily:
                  '"Cormorant Garamond", Georgia, serif',
              }}
            >
              {project.title}
            </h3>

            <p className="mt-3 max-w-2xl text-xs leading-5.5 text-white/75 sm:text-sm">
              {project.description}
            </p>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-y-0 z-30"
          style={{
            left: `${sliderPosition}%`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.25)]" />

          <button
            type="button"
            aria-label="Drag to compare before and after"
            className={`pointer-events-auto absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 touch-none cursor-ew-resize items-center justify-center rounded-full border border-white bg-white text-[#292820] shadow-[0_8px_24px_rgba(0,0,0,0.22)] transition-transform sm:h-16 sm:w-16 ${
              isDragging
                ? "scale-110 cursor-grabbing"
                : ""
            }`}
            onPointerDown={(event) => {
              event.preventDefault();
              event.stopPropagation();

              setIsDragging(true);

              event.currentTarget.setPointerCapture(
                event.pointerId
              );
            }}
            onPointerMove={(event) => {
              if (!isDragging) return;

              const parent =
                event.currentTarget.parentElement
                  ?.parentElement;

              if (!parent) return;

              const rect =
                parent.getBoundingClientRect();

              const position =
                ((event.clientX - rect.left) /
                  rect.width) *
                100;

              setSliderPosition(
                Math.min(100, Math.max(0, position))
              );
            }}
            onPointerUp={(event) => {
              setIsDragging(false);

              if (
                event.currentTarget.hasPointerCapture(
                  event.pointerId
                )
              ) {
                event.currentTarget.releasePointerCapture(
                  event.pointerId
                );
              }
            }}
            onPointerCancel={() => {
              setIsDragging(false);
            }}
          >
            <span className="text-xl leading-none">
              ‹›
            </span>
          </button>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-[#151510]/70 px-4 py-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
          Drag to compare
        </div>
      </div>

      <div className="flex h-full flex-col justify-center">
        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#9d8062]">
          Featured Project
        </p>

        <h3
          className="mt-5 max-w-lg text-[clamp(2.7rem,4vw,4.4rem)] font-normal leading-[0.88] tracking-tight text-[#292820]"
          style={{
            fontFamily:
              '"Cormorant Garamond", Georgia, serif',
          }}
        >
          {project.title}
        </h3>

        <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[#6e6b64]">
          {project.location && (
            <span className="text-[9px] uppercase tracking-[0.18em]">
              {project.location}
            </span>
          )}

          {project.location &&
            project.category && (
              <span className="text-[#9d8062]">
                |
              </span>
            )}

          {project.category && (
            <span className="text-[9px] uppercase tracking-[0.18em]">
              {project.category}
            </span>
          )}

          {project.style && (
            <>
              <span className="text-[#9d8062]">
                |
              </span>

              <span className="text-[9px] uppercase tracking-[0.18em]">
                {project.style}
              </span>
            </>
          )}
        </div>

        <div className="mt-7 h-px w-full bg-[#d8d0c4]" />

        <p className="mt-7 max-w-xl text-sm leading-7 text-[#6e6b64] sm:text-[15px]">
          {project.description}
        </p>

        <Link
          href="/projects"
          className="group mt-8 inline-flex w-fit items-center gap-5 bg-[#292820] px-7 py-4 text-[9px] font-medium uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-[#9d8062]"
        >
          <span>Explore All Projects</span>

          <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}