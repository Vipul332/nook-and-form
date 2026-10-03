
"use client";

import {
  useState,
  type FormEvent,
  type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminDesignApi } from "@/lib/api";

export default function CreateDesignPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("");
  const [style, setStyle] = useState("");
  const [colors, setColors] = useState("");
  const [materials, setMaterials] = useState("");
  const [tags, setTags] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [aiEnabled, setAiEnabled] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function splitValues(value: string) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    setSlug(generateSlug(value));
  }

  function handleSlugChange(value: string) {
    setSlug(generateSlug(value));
  }

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    setImages(selectedFiles);
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (images.length > 10) {
      setError("You can upload a maximum of 10 images.");
      return;
    }

    if (
      budgetMin &&
      budgetMax &&
      Number(budgetMin) > Number(budgetMax)
    ) {
      setError(
        "Minimum budget cannot be greater than maximum budget."
      );
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(
        "Slug must contain lowercase letters, numbers, and hyphens only."
      );
      return;
    }

    const formData = new FormData();

    formData.append("title", title.trim());
    formData.append("slug", slug.trim());
    formData.append("description", description.trim());
    formData.append("roomType", roomType.trim());
    formData.append("style", style.trim());

    formData.append(
      "colors",
      JSON.stringify(splitValues(colors))
    );

    formData.append(
      "materials",
      JSON.stringify(splitValues(materials))
    );

    formData.append(
      "tags",
      JSON.stringify(splitValues(tags))
    );

    if (budgetMin !== "") {
      formData.append("budgetMin", budgetMin);
    }

    if (budgetMax !== "") {
      formData.append("budgetMax", budgetMax);
    }

    formData.append("aiEnabled", String(aiEnabled));
    formData.append("featured", String(featured));
    formData.append("published", String(published));

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      setLoading(true);

      await adminDesignApi.createDesign(formData);

      router.push("/admin/designs");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to create design.";

      if (
        message.toLowerCase().includes("slug already exists")
      ) {
        setError(
          "This slug already exists. Change the slug to a unique value and try again."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Create Design
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add a new interior design to your collection.
          </p>
        </div>

        <Link
          href="/admin/designs"
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          Back to Designs
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border bg-white p-6 shadow-sm"
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="title" className="mb-1 block text-sm font-medium">
              Design Title *
            </label>
            <input
              id="title"
              required
              minLength={3}
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Modern Living Room"
            />
          </div>

          <div>
            <label htmlFor="slug" className="mb-1 block text-sm font-medium">
              Slug *
            </label>
            <input
              id="slug"
              required
              minLength={3}
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="modern-living-room"
            />
          </div>

          <div>
            <label htmlFor="roomType" className="mb-1 block text-sm font-medium">
              Room Type *
            </label>
            <input
              id="roomType"
              required
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Living Room"
            />
          </div>

          <div>
            <label htmlFor="style" className="mb-1 block text-sm font-medium">
              Design Style *
            </label>
            <input
              id="style"
              required
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Modern"
            />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium">
            Description *
          </label>
          <textarea
            id="description"
            required
            minLength={10}
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Describe the design..."
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="colors" className="mb-1 block text-sm font-medium">
              Colors
            </label>
            <input
              id="colors"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="White, Beige, Brown"
            />
          </div>

          <div>
            <label htmlFor="materials" className="mb-1 block text-sm font-medium">
              Materials
            </label>
            <input
              id="materials"
              value={materials}
              onChange={(e) => setMaterials(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Wood, Marble, Glass"
            />
          </div>
        </div>

        <div>
          <label htmlFor="tags" className="mb-1 block text-sm font-medium">
            Tags
          </label>
          <input
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full rounded-lg border p-3"
            placeholder="Luxury, Minimal, Apartment"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="budgetMin" className="mb-1 block text-sm font-medium">
              Minimum Budget
            </label>
            <input
              id="budgetMin"
              type="number"
              min="0"
              value={budgetMin}
              onChange={(e) => setBudgetMin(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="50000"
            />
          </div>

          <div>
            <label htmlFor="budgetMax" className="mb-1 block text-sm font-medium">
              Maximum Budget
            </label>
            <input
              id="budgetMax"
              type="number"
              min="0"
              value={budgetMax}
              onChange={(e) => setBudgetMax(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="200000"
            />
          </div>
        </div>

        <div>
          <label htmlFor="images" className="mb-1 block text-sm font-medium">
            Design Images
          </label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full rounded-lg border p-3"
          />
          <p className="mt-1 text-xs text-gray-500">
            Select up to 10 images.
          </p>

          {images.length > 0 && (
            <p className="mt-2 text-sm">
              {images.length} image(s) selected
            </p>
          )}
        </div>

        <div className="space-y-3 rounded-lg border p-4">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={aiEnabled}
              onChange={(e) => setAiEnabled(e.target.checked)}
            />
            <span className="text-sm">Enable AI recommendations</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
            />
            <span className="text-sm">Mark as featured</span>
          </label>

          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <span className="text-sm">Publish immediately</span>
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Design"}
          </button>

          <Link
            href="/admin/designs"
            className="rounded-lg border px-6 py-3"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}