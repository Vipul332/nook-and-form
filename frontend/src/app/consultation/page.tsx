"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import {
  publicConsultationApi,
  type CreateConsultationPayload,
} from "@/lib/api";

const initialFormData: CreateConsultationPayload = {
  name: "",
  phone: "",
  email: "",
  consultationType: "PHONE",
  preferredDate: "",
  preferredTime: "",
  location: "",
  message: "",
};

export default function ConsultationPage() {
  const [formData, setFormData] =
    useState<CreateConsultationPayload>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    field: keyof CreateConsultationPayload,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const payload: CreateConsultationPayload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        consultationType: formData.consultationType,
      };

      if (formData.preferredDate?.trim()) {
        payload.preferredDate = formData.preferredDate;
      }

      if (formData.preferredTime?.trim()) {
        payload.preferredTime = formData.preferredTime;
      }

      if (formData.location?.trim()) {
        payload.location = formData.location.trim();
      }

      if (formData.message?.trim()) {
        payload.message = formData.message.trim();
      }

      await publicConsultationApi.createConsultation(payload);

      setSuccessMessage(
        "Your consultation request has been submitted successfully. We will contact you soon."
      );

      setFormData({
        ...initialFormData,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to submit consultation request."
      );
    } finally {
      setLoading(false);
    }
  }

  const inputClassName =
    "w-full rounded-xl border border-[#D6C8AF] bg-[#FFFDF8] px-4 py-3.5 text-sm text-[#0B1F3A] outline-none transition focus:border-[#274C77] focus:ring-2 focus:ring-[#274C77]/10 placeholder:text-[#7A7F87]";

  const labelClassName =
    "mb-2 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5B6573]";

  return (
    <main className="min-h-screen bg-[#FFF7E8] text-[#0B1F3A]">
      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <header className="fixed left-0 right-0 top-0 z-50 h-19 border-b border-white/10 bg-[#0B1F3A]/95 text-[#FFF7E8] backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-1600px items-center justify-between px-5 sm:px-8 lg:px-12">
          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 leading-none"
          >
            <span className="block font-serif text-[24px] tracking-[0.16em] sm:text-[27px]">
              STUDIO
            </span>

            <span className="mt-1 block text-[7px] font-semibold uppercase tracking-[0.35em] text-[#DCC9AA]">
              Interior Design
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8]/75 transition hover:text-[#FFF7E8]"
            >
              Home
            </Link>

            <Link
              href="/designs"
              className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8]/75 transition hover:text-[#FFF7E8]"
            >
              Designs
            </Link>

            <Link
              href="/services"
              className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8]/75 transition hover:text-[#FFF7E8]"
            >
              Services
            </Link>

            <Link
              href="/projects"
              className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8]/75 transition hover:text-[#FFF7E8]"
            >
              Projects
            </Link>

            <Link
              href="/#reviews"
              className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8]/75 transition hover:text-[#FFF7E8]"
            >
              Reviews
            </Link>

            <Link
              href="/about"
              className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8]/75 transition hover:text-[#FFF7E8]"
            >
              About
            </Link>

            <Link
              href="/#contact"
              className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8]/75 transition hover:text-[#FFF7E8]"
            >
              Contact
            </Link>
          </nav>

          {/* CTA */}
          <Link
            href="/consultation"
            className="hidden items-center gap-3 rounded-full bg-[#FFF7E8] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#0B1F3A] transition hover:-translate-y-0.5 hover:bg-white sm:flex"
          >
            Book a Consultation
            <span className="text-sm leading-none">→</span>
          </Link>

          {/* Mobile */}
          <Link
            href="/"
            className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFF7E8]/80 sm:hidden"
          >
            Home
          </Link>
        </div>
      </header>

      {/* =========================================================
          MAIN CONSULTATION SECTION
      ========================================================= */}
      <section className="scroll-mt-19 px-5 pb-20 pt-32 sm:px-8 sm:pb-24 sm:pt-36 lg:px-12 lg:pb-28 lg:pt-40">
        <div className="mx-auto max-w-350">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
            {/* ===================================================
                LEFT CONTENT
            ==================================================== */}
            <div className="lg:sticky lg:top-28">
              <p className="mb-5 text-[9px] font-semibold uppercase tracking-[0.32em] text-[#C79B3B]">
                Design Consultation
              </p>

              <h1 className="max-w-2xl font-serif text-5xl leading-[0.95] tracking-[-0.035em] text-[#0B1F3A] sm:text-6xl lg:text-7xl">
                Let&apos;s discuss
                <span className="block text-[#274C77]">
                  your space.
                </span>
              </h1>

              <p className="mt-7 max-w-lg text-sm leading-7 text-[#5B6573] sm:text-[15px]">
                Tell us a little about your project,
                requirements, and the kind of space you
                want to create. We&apos;ll get back to you
                and discuss the right next steps.
              </p>

              <div className="mt-10 border-t border-[#D6C8AF] pt-7">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#5B6573]">
                  What happens next
                </p>

                <div className="mt-5 space-y-5">
                  <div className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0B1F3A] text-[10px] font-semibold text-[#FFF7E8]">
                      01
                    </span>

                    <div>
                      <h2 className="text-sm font-semibold text-[#0B1F3A]">
                        We review your request
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-[#5B6573]">
                        We&apos;ll understand your requirements
                        before getting in touch.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3E7D0] text-[10px] font-semibold text-[#0B1F3A]">
                      02
                    </span>

                    <div>
                      <h2 className="text-sm font-semibold text-[#0B1F3A]">
                        We connect with you
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-[#5B6573]">
                        We&apos;ll contact you to understand the
                        project in more detail.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3E7D0] text-[10px] font-semibold text-[#0B1F3A]">
                      03
                    </span>

                    <div>
                      <h2 className="text-sm font-semibold text-[#0B1F3A]">
                        We plan the next step
                      </h2>

                      <p className="mt-1 text-xs leading-5 text-[#5B6573]">
                        Together, we&apos;ll decide how to move
                        forward with your space.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===================================================
                FORM
            ==================================================== */}
            <div className="rounded-[28px] border border-[#D6C8AF] bg-[#FFFDF8] p-5 shadow-[0_20px_60px_rgba(11,31,58,0.08)] sm:p-8 lg:p-10">
              <div className="mb-8 border-b border-[#D6C8AF] pb-7">
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C79B3B]">
                  Start your project
                </p>

                <h2 className="mt-2 font-serif text-3xl tracking-[-0.02em] text-[#0B1F3A]">
                  Tell us about your project
                </h2>

                <p className="mt-2 max-w-xl text-xs leading-5 text-[#5B6573]">
                  Fields marked with an asterisk are required.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                {/* Name + Phone */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className={labelClassName}
                    >
                      Name *
                    </label>

                    <input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(event) =>
                        handleChange(
                          "name",
                          event.target.value
                        )
                      }
                      className={inputClassName}
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className={labelClassName}
                    >
                      Phone number *
                    </label>

                    <input
                      id="phone"
                      type="tel"
                      placeholder="Your phone number"
                      value={formData.phone}
                      onChange={(event) =>
                        handleChange(
                          "phone",
                          event.target.value
                        )
                      }
                      className={inputClassName}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className={labelClassName}
                  >
                    Email address *
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(event) =>
                      handleChange(
                        "email",
                        event.target.value
                      )
                    }
                    className={inputClassName}
                    required
                  />
                </div>

                {/* Consultation Type */}
                <div>
                  <label
                    htmlFor="consultationType"
                    className={labelClassName}
                  >
                    Consultation type *
                  </label>

                  <select
                    id="consultationType"
                    value={formData.consultationType}
                    onChange={(event) =>
                      handleChange(
                        "consultationType",
                        event.target.value
                      )
                    }
                    className={inputClassName}
                    required
                  >
                    <option value="PHONE">
                      Phone
                    </option>

                    <option value="WHATSAPP">
                      WhatsApp
                    </option>

                    <option value="ONLINE">
                      Online
                    </option>

                    <option value="OFFICE_VISIT">
                      Office Visit
                    </option>

                    <option value="SITE_VISIT">
                      Site Visit
                    </option>
                  </select>
                </div>

                {/* Date + Time */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="preferredDate"
                      className={labelClassName}
                    >
                      Preferred date
                    </label>

                    <input
                      id="preferredDate"
                      type="date"
                      value={formData.preferredDate}
                      onChange={(event) =>
                        handleChange(
                          "preferredDate",
                          event.target.value
                        )
                      }
                      className={inputClassName}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="preferredTime"
                      className={labelClassName}
                    >
                      Preferred time
                    </label>

                    <input
                      id="preferredTime"
                      type="text"
                      placeholder="e.g. 11:00 AM"
                      value={formData.preferredTime}
                      onChange={(event) =>
                        handleChange(
                          "preferredTime",
                          event.target.value
                        )
                      }
                      className={inputClassName}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label
                    htmlFor="location"
                    className={labelClassName}
                  >
                    Location
                  </label>

                  <input
                    id="location"
                    type="text"
                    placeholder="City or site location"
                    value={formData.location}
                    onChange={(event) =>
                      handleChange(
                        "location",
                        event.target.value
                      )
                    }
                    className={inputClassName}
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className={labelClassName}
                  >
                    Tell us about your project
                  </label>

                  <textarea
                    id="message"
                    rows={6}
                    placeholder="Tell us about your space, requirements, budget, style, or anything else you would like us to know..."
                    value={formData.message}
                    onChange={(event) =>
                      handleChange(
                        "message",
                        event.target.value
                      )
                    }
                    className={`${inputClassName} resize-none`}
                  />
                </div>

                {/* Success */}
                {successMessage && (
                  <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
                    {successMessage}
                  </div>
                )}

                {/* Error */}
                {errorMessage && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                    {errorMessage}
                  </div>
                )}

                {/* Submit */}
                <div className="flex flex-col gap-4 border-t border-[#D6C8AF] pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-[11px] leading-5 text-[#7A7F87]">
                    By submitting this form, you are
                    requesting a consultation with our
                    design studio.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex shrink-0 items-center justify-center gap-3 rounded-full bg-[#0B1F3A] px-7 py-3.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#FFF7E8] transition duration-300 hover:-translate-y-0.5 hover:bg-[#274C77] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading
                      ? "Submitting..."
                      : "Request Consultation"}

                    <span className="text-sm leading-none">
                      →
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-[#D6C8AF] bg-[#0B1F3A] px-5 py-10 text-[#FFF7E8] sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-350 flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="/"
              className="font-serif text-xl tracking-[0.12em]"
            >
              STUDIO
            </Link>

            <p className="mt-2 text-[8px] uppercase tracking-[0.3em] text-[#DCC9AA]">
              Interior Design
            </p>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/"
              className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFF7E8]/70 transition hover:text-[#FFF7E8]"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFF7E8]/70 transition hover:text-[#FFF7E8]"
            >
              Services
            </Link>

            <Link
              href="/projects"
              className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFF7E8]/70 transition hover:text-[#FFF7E8]"
            >
              Projects
            </Link>

            <Link
              href="/#contact"
              className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFF7E8]/70 transition hover:text-[#FFF7E8]"
            >
              Contact
            </Link>
          </div>

          <p className="text-[9px] uppercase tracking-[0.14em] text-[#FFF7E8]/45">
            © {new Date().getFullYear()} Studio
          </p>
        </div>
      </footer>

      {/* =========================================================
          WHATSAPP
      ========================================================= */}
      <a
        href="https://wa.me/918700197668?text=Hi%2C%20I%27m%20interested%20in%20your%20interior%20design%20services.%20I%27d%20like%20to%20know%20more"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(11,31,58,0.22)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-[0_14px_35px_rgba(11,31,58,0.28)] sm:bottom-7 sm:right-7"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7 fill-current"
          aria-hidden="true"
        >
          <path d="M16 2.7C8.67 2.7 2.7 8.67 2.7 16c0 2.35.61 4.56 1.77 6.51L2.62 29.3l6.95-1.82A13.23 13.23 0 0 0 16 29.3c7.33 0 13.3-5.97 13.3-13.3S23.33 2.7 16 2.7Zm0 24.17c-2.1 0-4.16-.56-5.95-1.62l-.43-.25-4.13 1.08 1.1-4.03-.28-.44A10.99 10.99 0 1 1 16 26.87Zm6.03-8.24c-.33-.17-1.96-.97-2.26-1.08-.3-.11-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.38.25-.7.08-.33-.17-1.38-.51-2.63-1.63-.97-.87-1.63-1.94-1.82-2.27-.19-.33-.02-.51.14-.68.15-.15.33-.38.49-.57.16-.19.22-.33.33-.55.11-.22.05-.41-.03-.57-.08-.17-.74-1.8-1.01-2.47-.27-.65-.54-.56-.74-.57h-.63c-.22 0-.57.08-.87.41-.3.33-1.14 1.11-1.14 2.72s1.17 3.16 1.33 3.38c.16.22 2.3 3.51 5.57 4.92.78.34 1.39.55 1.86.7.78.25 1.49.22 2.05.13.63-.09 1.96-.8 2.24-1.57.28-.77.28-1.43.19-1.57-.08-.14-.3-.22-.63-.39Z" />
        </svg>

        <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-[#0B1F3A] px-3 py-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#FFF7E8] opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 sm:block">
          Chat on WhatsApp
        </span>
      </a>
    </main>
  );
}