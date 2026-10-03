"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { adminServiceApi } from "@/lib/api";

export default function NewServicePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [startingPrice, setStartingPrice] = useState("");
  const [features, setFeatures] = useState("");
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] =
    useState<"draft" | "published">("draft");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const featureList = features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append(
        "slug",
        slug.trim().toLowerCase()
      );
      formData.append(
        "description",
        description.trim()
      );
      formData.append(
        "shortDescription",
        shortDescription.trim()
      );
      formData.append(
        "features",
        JSON.stringify(featureList)
      );
      formData.append(
        "featured",
        String(featured)
      );
      formData.append("status", status);

      if (startingPrice.trim()) {
        formData.append(
          "startingPrice",
          startingPrice.trim()
        );
      }

      if (image) {
        formData.append("image", image);
      }

      await adminServiceApi.createService(formData);

      router.push("/admin/services");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create service"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-6">
      <div className="mb-6">
        <Link
          href="/admin/services"
          className="text-sm text-gray-500 hover:text-black"
        >
          ← Back to Services
        </Link>

        <h1 className="mt-3 text-2xl font-bold">
          Create Service
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new interior design service.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl space-y-6 rounded-lg border bg-white p-6"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium"
          >
            Service Name *
          </label>

          <input
            id="name"
            type="text"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
            maxLength={150}
            placeholder="Premium Modular Kitchen Design"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="mb-2 block text-sm font-medium"
          >
            Slug *
          </label>

          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(event) =>
              setSlug(event.target.value)
            }
            required
            maxLength={180}
            placeholder="modular-kitchen-design"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          />

          <p className="mt-1 text-xs text-gray-500">
            Use lowercase letters, numbers, and hyphens.
          </p>
        </div>

        <div>
          <label
            htmlFor="shortDescription"
            className="mb-2 block text-sm font-medium"
          >
            Short Description
          </label>

          <input
            id="shortDescription"
            type="text"
            value={shortDescription}
            onChange={(event) =>
              setShortDescription(event.target.value)
            }
            maxLength={300}
            placeholder="Complete premium modular kitchen planning."
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Description *
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
            required
            minLength={10}
            maxLength={5000}
            rows={6}
            placeholder="Describe the service in detail..."
            className="w-full resize-y rounded-lg border px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="image"
            className="mb-2 block text-sm font-medium"
          >
            Service Image
          </label>

          <input
            id="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setImage(
                event.target.files?.[0] ?? null
              )
            }
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />

          <p className="mt-1 text-xs text-gray-500">
            JPG, PNG or WEBP. Maximum size: 5 MB.
          </p>

          {image && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: {image.name}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="startingPrice"
            className="mb-2 block text-sm font-medium"
          >
            Starting Price
          </label>

          <input
            id="startingPrice"
            type="number"
            min="0"
            step="1"
            value={startingPrice}
            onChange={(event) =>
              setStartingPrice(event.target.value)
            }
            placeholder="200000"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          />
        </div>

        <div>
          <label
            htmlFor="features"
            className="mb-2 block text-sm font-medium"
          >
            Features
          </label>

          <textarea
            id="features"
            value={features}
            onChange={(event) =>
              setFeatures(event.target.value)
            }
            rows={4}
            placeholder="3D design, Material selection, Custom storage planning"
            className="w-full resize-y rounded-lg border px-3 py-2 outline-none focus:border-black"
          />

          <p className="mt-1 text-xs text-gray-500">
            Separate each feature with a comma.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="featured"
            type="checkbox"
            checked={featured}
            onChange={(event) =>
              setFeatured(event.target.checked)
            }
            className="h-4 w-4"
          />

          <label
            htmlFor="featured"
            className="text-sm font-medium"
          >
            Featured Service
          </label>
        </div>

        <div>
          <label
            htmlFor="status"
            className="mb-2 block text-sm font-medium"
          >
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(event) =>
              setStatus(
                event.target.value as
                  | "draft"
                  | "published"
              )
            }
            className="w-full rounded-lg border px-3 py-2 outline-none focus:border-black"
          >
            <option value="draft">Draft</option>
            <option value="published">
              Published
            </option>
          </select>
        </div>

        <div className="flex gap-3 border-t pt-5">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Creating..."
              : "Create Service"}
          </button>

          <Link
            href="/admin/services"
            className="rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </main>
  );
}