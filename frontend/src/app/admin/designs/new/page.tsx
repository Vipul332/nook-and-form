"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { adminDesignApi } from "@/lib/api";

export default function NewDesignPage() {
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
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [tags, setTags] = useState("");
  const [aiEnabled, setAiEnabled] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(false);
  const [images, setImages] = useState<FileList | null>(
    null
  );

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (!images || images.length === 0) {
        throw new Error(
          "Please select at least one image"
        );
      }

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

      if (budgetMin) {
        formData.append("budgetMin", budgetMin);
      }

      if (budgetMax) {
        formData.append("budgetMax", budgetMax);
      }

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

      Array.from(images).forEach((file) => {
        formData.append("images", file);
      });

      await adminDesignApi.createDesign(formData);

      router.push("/admin/designs");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create design"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/designs")
            }
            className="mb-4 text-sm text-gray-600 hover:text-black"
          >
            ← Back to designs
          </button>

          <h1 className="text-3xl font-bold">
            Create Design
          </h1>

          <p className="mt-2 text-gray-600">
            Add a new interior design to your catalog.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Basic Information
            </h2>

            <div className="grid gap-5">
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
                  minLength={3}
                  maxLength={150}
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="Modern Luxury Living Room"
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
                  placeholder="modern-luxury-living-room"
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
                  placeholder="Describe the interior design..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Design Classification
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="living-room"
                />
              </div>

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
                  placeholder="modern"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Colors
                </label>

                <input
                  value={colors}
                  onChange={(e) =>
                    setColors(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="white,beige,brown"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Materials
                </label>

                <input
                  value={materials}
                  onChange={(e) =>
                    setMaterials(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="wood,marble"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Tags
                </label>

                <input
                  value={tags}
                  onChange={(e) =>
                    setTags(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="luxury,modern,living-room"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Budget
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Minimum Budget
                </label>

                <input
                  type="number"
                  min="0"
                  value={budgetMin}
                  onChange={(e) =>
                    setBudgetMin(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="150000"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Maximum Budget
                </label>

                <input
                  type="number"
                  min="0"
                  value={budgetMax}
                  onChange={(e) =>
                    setBudgetMax(e.target.value)
                  }
                  className="w-full rounded-lg border px-4 py-3"
                  placeholder="350000"
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Images
            </h2>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              required
              onChange={(e) =>
                setImages(e.target.files)
              }
              className="w-full rounded-lg border p-3"
            />

            <p className="mt-2 text-sm text-gray-500">
              JPG, PNG or WEBP. Maximum 10 images,
              5 MB each.
            </p>

            {images && images.length > 0 && (
              <p className="mt-3 text-sm font-medium">
                {images.length} image(s) selected
              </p>
            )}
          </section>

          <section className="rounded-xl border p-6">
            <h2 className="mb-5 text-xl font-semibold">
              Publishing
            </h2>

            <div className="space-y-4">
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

              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) =>
                    setPublished(e.target.checked)
                  }
                  className="h-4 w-4"
                />

                <span>Publish immediately</span>
              </label>
            </div>
          </section>

          <div className="flex justify-end gap-3 pb-10">
            <button
              type="button"
              onClick={() =>
                router.push("/admin/designs")
              }
              className="rounded-lg border px-6 py-3"
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-black px-6 py-3 text-white disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : "Create Design"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}