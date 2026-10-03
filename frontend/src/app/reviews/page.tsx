"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  publicTestimonialApi,
  type Testimonial,
} from "@/lib/api";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadReviews = async () => {
      try {
        setLoading(true);
        setError("");

        const result =
          await publicTestimonialApi.getTestimonials();

        if (!result.success) {
          throw new Error(
            result.message || "Failed to load reviews"
          );
        }

        if (!cancelled) {
          setReviews(result.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load reviews"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadReviews();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f1eb] text-[#202020]">
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-black/10">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="max-w-4xl">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.28em] text-[#766b60]">
              Client Stories
            </p>

            <h1 className="font-serif text-5xl leading-[0.98] tracking-[-0.035em] sm:text-6xl lg:text-8xl">
              Spaces are personal.
              <br />
              <span className="italic">
                So are the stories.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-[#625c55] sm:text-lg">
              Every project begins with a vision and ends with
              a space that feels distinctly yours. Here is what
              our clients have to say about that journey.
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full border border-[#9d8d7c]/20" />
        <div className="pointer-events-none absolute -bottom-8 -right-8 h-48 w-48 rounded-full border border-[#9d8d7c]/15" />
      </section>

      {/* REVIEWS */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mb-14 flex flex-col gap-5 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-[#766b60]">
              What our clients say
            </p>

            <h2 className="mt-3 font-serif text-3xl tracking-[-0.02em] sm:text-4xl">
              Designed around real lives.
            </h2>
          </div>

          {!loading && reviews.length > 0 && (
            <p className="text-sm text-[#766b60]">
              {reviews.length}{" "}
              {reviews.length === 1 ? "story" : "stories"}
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-sm border border-black/10 bg-white/40"
              />
            ))}
          </div>
        ) : error ? (
          <div className="border border-black/10 bg-white/50 p-8">
            <p className="text-sm text-[#8a4b42]">
              {error}
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="border border-black/10 bg-white/50 px-6 py-16 text-center">
            <p className="font-serif text-3xl">
              No stories yet.
            </p>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#766b60]">
              Client stories will appear here as projects are
              completed and reviews are published.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <article
                key={review._id}
                className="group flex min-h-80 flex-col justify-between border border-black/10 bg-white/55 p-7 transition duration-300 hover:-translate-y-1 hover:bg-white sm:p-8"
              >
                <div>
                  {/* RATING */}
                  <div
                    className="flex items-center gap-1"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {Array.from({ length: 5 }).map(
                      (_, index) => (
                        <span
                          key={index}
                          className={
                            index < review.rating
                              ? "text-[#8c765f]"
                              : "text-black/15"
                          }
                        >
                          ★
                        </span>
                      )
                    )}
                  </div>

                  {/* MESSAGE */}
                  <blockquote className="mt-7 font-serif text-xl leading-8 tracking-[-0.015em] text-[#292929]">
                    “{review.message}”
                  </blockquote>
                </div>

                {/* CLIENT */}
                <div className="mt-10 flex items-center gap-4 border-t border-black/10 pt-5">
                  {review.imageUrl ? (
                    <div className="h-11 w-11 shrink-0 overflow-hidden rounded-full">
                     <Image
  src={review.imageUrl}
  alt={review.name}
  width={44}
  height={44}
  className="h-full w-full object-cover"
/>
                    </div>
                  ) : (
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ded6cc] font-serif text-lg text-[#5f554b]">
                      {review.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-medium text-[#292929]">
                      {review.name}
                    </p>

                    {review.role && (
                      <p className="mt-0.5 text-xs text-[#766b60]">
                        {review.role}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-black/10 bg-[#202b32] text-[#f5f1eb]">
        <div className="mx-auto max-w-7xl px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b7aa9b]">
                Your space, your story
              </p>

              <h2 className="mt-5 font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Ready to create a space
                <br />
                <span className="italic">
                  that feels like yours?
                </span>
              </h2>
            </div>

            <Link
              href="/consultation"
              className="inline-flex w-fit items-center border border-[#f5f1eb]/40 px-6 py-3 text-sm uppercase tracking-[0.16em] transition hover:bg-[#f5f1eb] hover:text-[#202b32]"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}