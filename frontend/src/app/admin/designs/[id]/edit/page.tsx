"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { adminDesignApi, Design } from "@/lib/api";

export default function EditDesignPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [design, setDesign] = useState<Design | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageAction, setImageAction] = useState<string | null>(null);

  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [roomType, setRoomType] = useState("");
  const [style, setStyle] = useState("");
  const [colors, setColors] = useState("");
  const [materials, setMaterials] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [tags, setTags] = useState("");

  const [aiEnabled, setAiEnabled] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);

  const [newImages, setNewImages] = useState<FileList | null>(null);

  useEffect(() => {
    const loadDesign = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await adminDesignApi.getDesign(id);

        if (!response.data) {
          throw new Error("Design data not found");
        }

        const result = response.data;

        setDesign(result);

        setTitle(result.title);
        setSlug(result.slug);
        setDescription(result.description);
        setRoomType(result.roomType);
        setStyle(result.style);

        // Convert arrays into comma-separated text
        setColors(result.colors.join(", "));
        setMaterials(result.materials.join(", "));
        setTags(result.tags.join(", "));

        setBudgetMin(
          result.budgetMin !== undefined
            ? String(result.budgetMin)
            : ""
        );

        setBudgetMax(
          result.budgetMax !== undefined
            ? String(result.budgetMax)
            : ""
        );

        setAiEnabled(result.aiEnabled);
        setFeatured(result.featured);
        setPublished(result.published);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load design"
        );
      } finally {
        setLoading(false);
      }
    };

    loadDesign();
  }, [id]);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();

      formData.append("title", title);
      formData.append("slug", slug);
      formData.append("description", description);
      formData.append("roomType", roomType);
      formData.append("style", style);

      const colorsArray = colors
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const materialsArray = materials
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const tagsArray = tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      formData.append(
        "colors",
        JSON.stringify(colorsArray)
      );

      formData.append(
        "materials",
        JSON.stringify(materialsArray)
      );

      formData.append(
        "tags",
        JSON.stringify(tagsArray)
      );

      formData.append(
        "aiEnabled",
        String(aiEnabled)
      );

      formData.append(
        "featured",
        String(featured)
      );

      formData.append(
        "published",
        String(published)
      );

      if (budgetMin.trim() !== "") {
        formData.append("budgetMin", budgetMin);
      }

      if (budgetMax.trim() !== "") {
        formData.append("budgetMax", budgetMax);
      }

      // Add new images to the same FormData.
      if (newImages && newImages.length > 0) {
        Array.from(newImages).forEach((file) => {
          formData.append("images", file);
        });
      }

      await adminDesignApi.updateDesign(
        id,
        formData
      );

      router.push("/admin/designs");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update design"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteImage = async (publicId: string) => {
    const confirmed = window.confirm(
      "Delete this image permanently?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setImageAction(publicId);
      setError("");

      const response =
        await adminDesignApi.deleteDesignImage(
          id,
          publicId
        );

      if (!response.data) {
        throw new Error(
          "Updated design data not found"
        );
      }

      setDesign(response.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete image"
      );
    } finally {
      setImageAction(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen p-8">
        <p>Loading design...</p>
      </main>
    );
  }

  if (!design) {
    return (
      <main className="min-h-screen p-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-red-600">
            {error || "Design not found"}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.push("/admin/designs")}
          className="mb-5 text-sm text-gray-600 hover:text-black"
        >
          ← Back to designs
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Edit Design
          </h1>

          <p className="mt-2 text-gray-600">
            Update your interior design catalog entry.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Information */}
          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Basic Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Title
                </label>

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Slug
                </label>

                <input
                  value={slug}
                  onChange={(e) =>
                    setSlug(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                  required
                  rows={5}
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Classification
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Room Type */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Room Type
                </label>

                <input
                  value={roomType}
                  onChange={(e) =>
                    setRoomType(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              {/* Style */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Style
                </label>

                <input
                  value={style}
                  onChange={(e) =>
                    setStyle(e.target.value)
                  }
                  required
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Colors
                </label>

                <input
                  value={colors}
                  onChange={(e) =>
                    setColors(e.target.value)
                  }
                  placeholder="White, Beige, Brown"
                  className="w-full rounded-lg border px-4 py-3"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple colors with commas.
                </p>
              </div>

              {/* Materials */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Materials
                </label>

                <input
                  value={materials}
                  onChange={(e) =>
                    setMaterials(e.target.value)
                  }
                  placeholder="Wood, Glass, Marble"
                  className="w-full rounded-lg border px-4 py-3"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple materials with commas.
                </p>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">
                  Tags
                </label>

                <input
                  value={tags}
                  onChange={(e) =>
                    setTags(e.target.value)
                  }
                  placeholder="modern, luxury, minimal"
                  className="w-full rounded-lg border px-4 py-3"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple tags with commas.
                </p>
              </div>
            </div>
          </section>

          {/* Budget */}
          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Budget
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {/* Minimum */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Minimum
                </label>

                <input
                  type="number"
                  min="0"
                  value={budgetMin}
                  onChange={(e) =>
                    setBudgetMin(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>

              {/* Maximum */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Maximum
                </label>

                <input
                  type="number"
                  min="0"
                  value={budgetMax}
                  onChange={(e) =>
                    setBudgetMax(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                />
              </div>
            </div>
          </section>

          {/* Existing Images */}
          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Existing Images
            </h2>

            {design.images.length === 0 ? (
              <p className="text-gray-500">
                No images uploaded.
              </p>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {design.images.map((image) => (
                  <div
                    key={image.publicId}
                    className="overflow-hidden rounded-xl border"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || design.title}
                      width={500}
                      height={300}
                      className="h-48 w-full object-cover"
                    />

                    <div className="p-3">
                      <button
                        type="button"
                        onClick={() =>
                          deleteImage(image.publicId)
                        }
                        disabled={
                          imageAction === image.publicId
                        }
                        className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        {imageAction === image.publicId
                          ? "Deleting..."
                          : "Delete Image"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Add Images */}
          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Add Images
            </h2>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) =>
                setNewImages(e.target.files)
              }
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG or WEBP. Maximum 10 images,
              5 MB each.
            </p>
          </section>

          {/* Publishing */}
          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Publishing
            </h2>

            <div className="space-y-4">
              {/* AI */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={aiEnabled}
                  onChange={(e) =>
                    setAiEnabled(e.target.checked)
                  }
                  className="h-4 w-4"
                />

                <span>
                  Enable AI recommendations
                </span>
              </label>

              {/* Featured */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) =>
                    setFeatured(e.target.checked)
                  }
                  className="h-4 w-4"
                />

                <span>Featured design</span>
              </label>

              {/* Published */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) =>
                    setPublished(e.target.checked)
                  }
                  className="h-4 w-4"
                />

                <span>Published</span>
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() =>
                router.push("/admin/designs")
              }
              disabled={saving}
              className="rounded-lg border px-6 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

