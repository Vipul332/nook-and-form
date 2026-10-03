"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

import {
  adminProjectApi,
  Project,
} from "@/lib/api";

type ImageLike =
  | string
  | {
      url?: string;
      publicId?: string;
      alt?: string;
    }
  | null
  | undefined;

function getImageUrl(image: ImageLike): string {
  if (!image) {
    return "";
  }

  if (typeof image === "string") {
    return image;
  }

  return typeof image.url === "string"
    ? image.url
    : "";
}

function getImageAlt(
  image: ImageLike,
  fallback: string
): string {
  if (
    image &&
    typeof image !== "string" &&
    typeof image.alt === "string" &&
    image.alt.trim()
  ) {
    return image.alt;
  }

  return fallback;
}

function getImagePublicId(
  image: ImageLike
): string {
  if (
    image &&
    typeof image !== "string" &&
    typeof image.publicId === "string"
  ) {
    return image.publicId;
  }

  return "";
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params.id;

  const id =
    typeof rawId === "string"
      ? rawId
      : Array.isArray(rawId)
        ? rawId[0]
        : undefined;

  const [project, setProject] =
    useState<Project | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] =
    useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [materials, setMaterials] =
    useState("");

  const [featured, setFeatured] =
    useState(false);
  const [published, setPublished] =
    useState(false);

  const [images, setImages] =
    useState<File[]>([]);

  const [beforeImage, setBeforeImage] =
    useState<File | null>(null);

  const [afterImage, setAfterImage] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (
      typeof id !== "string" ||
      !id
    ) {
      return;
    }

    const projectId = id;

    let cancelled = false;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const result =
          await adminProjectApi.getProject(
            projectId
          );

        if (cancelled) {
          return;
        }

        if (!result.data) {
          throw new Error(
            result.message ||
              "Project not found"
          );
        }

        const projectData =
          result.data;

        setProject(projectData);

        setTitle(
          projectData.title ?? ""
        );

        setSlug(
          projectData.slug ?? ""
        );

        setDescription(
          projectData.description ?? ""
        );

        setLocation(
          projectData.location ?? ""
        );

        setCategory(
          projectData.category ?? ""
        );

        setStyle(
          projectData.style ?? ""
        );

        setMaterials(
          projectData.materials?.join(
            ", "
          ) ?? ""
        );

        setFeatured(
          Boolean(
            projectData.featured
          )
        );

        setPublished(
          Boolean(
            projectData.published
          )
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        setProject(null);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load project"
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  function generateSlug(
    value: string
  ) {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9\s-]/g,
        ""
      )
      .replace(
        /\s+/g,
        "-"
      )
      .replace(
        /-+/g,
        "-"
      );
  }

  function handleImagesChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    const existingCount =
      project?.images?.length ?? 0;

    const remainingSlots =
      Math.max(
        0,
        10 - existingCount
      );

    if (remainingSlots === 0) {
      setError(
        "This project already has the maximum of 10 gallery images."
      );

      setImages([]);

      return;
    }

    if (
      files.length >
      remainingSlots
    ) {
      setError(
        `You can add only ${remainingSlots} more gallery image${
          remainingSlots !== 1
            ? "s"
            : ""
        }.`
      );

      setImages(
        files.slice(
          0,
          remainingSlots
        )
      );

      return;
    }

    setError("");
    setImages(files);
  }

  function handleBeforeImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ??
      null;

    setBeforeImage(file);
    setError("");
  }

  function handleAfterImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ??
      null;

    setAfterImage(file);
    setError("");
  }

  async function handleDeleteImage(
    publicId?: string
  ) {
    if (
      typeof id !== "string" ||
      !id
    ) {
      setError(
        "Project ID is missing."
      );

      return;
    }

    if (!publicId) {
      setError(
        "Image public ID is missing."
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Delete this gallery image? This action cannot be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      const result =
        await adminProjectApi.deleteProjectImage(
          id,
          publicId
        );

      if (!result.data) {
        throw new Error(
          result.message ||
            "Unable to delete project image"
        );
      }

      setProject(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete project image"
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      typeof id !== "string" ||
      !id
    ) {
      setError(
        "Project ID is missing."
      );

      return;
    }

    if (title.trim().length < 3) {
      setError(
        "Project title must contain at least 3 characters."
      );

      return;
    }

    if (slug.trim().length < 3) {
      setError(
        "Project slug must contain at least 3 characters."
      );

      return;
    }

    if (
      description.trim().length <
      10
    ) {
      setError(
        "Project description must contain at least 10 characters."
      );

      return;
    }

    setError("");
    setSaving(true);

    try {
      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "slug",
        slug.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      if (location.trim()) {
        formData.append(
          "location",
          location.trim()
        );
      }

      if (category.trim()) {
        formData.append(
          "category",
          category.trim()
        );
      }

      if (style.trim()) {
        formData.append(
          "style",
          style.trim()
        );
      }

      const materialList =
        materials
          .split(",")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean);

      formData.append(
        "materials",
        JSON.stringify(
          materialList
        )
      );

      formData.append(
        "featured",
        String(featured)
      );

      formData.append(
        "published",
        String(published)
      );

      for (const image of images) {
        formData.append(
          "images",
          image
        );
      }

      if (beforeImage) {
        formData.append(
          "beforeImage",
          beforeImage
        );
      }

      if (afterImage) {
        formData.append(
          "afterImage",
          afterImage
        );
      }

      const result =
        await adminProjectApi.updateProject(
          id,
          formData
        );

      if (!result.success) {
        throw new Error(
          result.message ||
            "Failed to update project"
        );
      }

      router.push(
        "/admin/projects"
      );

      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update project"
      );
    } finally {
      setSaving(false);
    }
  }

  if (
    typeof id !== "string" ||
    !id
  ) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          Project ID is missing.
        </div>

        <Link
          href="/admin/projects"
          className="mt-5 inline-flex text-sm text-gray-600 transition hover:text-gray-900"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div className="rounded-2xl border border-gray-200 bg-white p-8">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />

          <div className="mt-4 h-4 w-64 animate-pulse rounded bg-gray-100" />

          <div className="mt-8 space-y-4">
            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />

            <div className="h-12 animate-pulse rounded-xl bg-gray-100" />

            <div className="h-32 animate-pulse rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto w-full max-w-5xl">
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700"
        >
          {error ||
            "Project not found."}
        </div>

        <Link
          href="/admin/projects"
          className="mt-5 inline-flex text-sm text-gray-600 transition hover:text-gray-900"
        >
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const existingGalleryCount =
    project.images?.length ?? 0;

  const remainingGallerySlots =
    Math.max(
      0,
      10 - existingGalleryCount
    );

  const projectBeforeImage =
    getImageUrl(
      project.beforeImage as ImageLike
    );

  const projectBeforeAlt =
    getImageAlt(
      project.beforeImage as ImageLike,
      "Before transformation"
    );

  const projectAfterImage =
    getImageUrl(
      project.afterImage as ImageLike
    );

  const projectAfterAlt =
    getImageAlt(
      project.afterImage as ImageLike,
      "After transformation"
    );

  return (
    <div className="mx-auto w-full max-w-6xl pb-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-gray-500 transition hover:text-gray-900"
        >
          ← Back to Projects
        </Link>

        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              Project Management
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              Edit Project
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Update project information,
              transformation imagery, gallery
              and publishing settings.
            </p>
          </div>

          <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600">
            {project.published
              ? "Published"
              : "Unpublished"}
          </div>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {/* Basic Information */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              01
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Keep the project identity clear and
              consistent.
            </p>
          </div>

          <div className="mt-6 grid gap-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Project Title *
              </label>

              <input
                id="title"
                type="text"
                required
                minLength={3}
                value={title}
                onChange={(event) =>
                  setTitle(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Slug *
              </label>

              <input
                id="slug"
                type="text"
                required
                minLength={3}
                value={slug}
                onChange={(event) =>
                  setSlug(
                    generateSlug(
                      event.target.value
                    )
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
              />

              <p className="mt-2 text-xs text-gray-400">
                Lowercase letters, numbers and
                hyphens only.
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Description *
              </label>

              <textarea
                id="description"
                required
                minLength={10}
                rows={5}
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition focus:border-gray-900 focus:bg-white focus:ring-2 focus:ring-gray-900/5"
              />
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              02
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Project Details
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Location
              </label>

              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="style"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Style
              </label>

              <input
                id="style"
                type="text"
                value={style}
                onChange={(event) =>
                  setStyle(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white"
              />
            </div>

            <div>
              <label
                htmlFor="materials"
                className="mb-2 block text-sm font-medium text-gray-800"
              >
                Materials
              </label>

              <input
                id="materials"
                type="text"
                value={materials}
                onChange={(event) =>
                  setMaterials(
                    event.target.value
                  )
                }
                placeholder="Wood, Marble, Glass"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:bg-white"
              />

              <p className="mt-2 text-xs text-gray-400">
                Separate multiple materials with commas.
              </p>
            </div>
          </div>
        </section>

        {/* Transformation */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              03
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Transformation
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage the dedicated before and after
              images for this project.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Before */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                {projectBeforeImage ? (
                  <Image
                    src={projectBeforeImage}
                    alt={projectBeforeAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No before image
                  </div>
                )}

                <div className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  Before
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-semibold text-gray-900">
                  Before Image
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Upload a new image only if you want
                  to replace the current one.
                </p>

                <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 transition hover:border-gray-500 hover:bg-gray-50">
                  <span className="max-w-[75%] truncate text-sm font-medium text-gray-700">
                    {beforeImage
                      ? beforeImage.name
                      : "Choose replacement"}
                  </span>

                  <span className="text-xs font-semibold text-gray-500">
                    Browse
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleBeforeImageChange
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* After */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50">
              <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                {projectAfterImage ? (
                  <Image
                    src={projectAfterImage}
                    alt={projectAfterAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No after image
                  </div>
                )}

                <div className="absolute left-4 top-4 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  After
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-semibold text-gray-900">
                  After Image
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Upload a new image only if you want
                  to replace the current one.
                </p>

                <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 transition hover:border-gray-500 hover:bg-gray-50">
                  <span className="max-w-[75%] truncate text-sm font-medium text-gray-700">
                    {afterImage
                      ? afterImage.name
                      : "Choose replacement"}
                  </span>

                  <span className="text-xs font-semibold text-gray-500">
                    Browse
                  </span>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={
                      handleAfterImageChange
                    }
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {(beforeImage ||
            afterImage) && (
            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
              The selected image will replace
              the existing image when you save
              changes.
            </div>
          )}
        </section>

        {/* Gallery */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gray-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                04
              </p>

              <h2 className="mt-1 text-xl font-semibold text-gray-900">
                Project Gallery
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Showcase additional project imagery.
              </p>
            </div>

            <div className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
              {existingGalleryCount} / 10
              images
            </div>
          </div>

          {existingGalleryCount ===
          0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
              <p className="text-sm font-medium text-gray-700">
                No gallery images yet
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Add images below to build the project
                gallery.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {project.images.map(
                (image, index) => {
                  const imageUrl =
                    getImageUrl(
                      image as ImageLike
                    );

                  const imageAlt =
                    getImageAlt(
                      image as ImageLike,
                      `Project image ${
                        index + 1
                      }`
                    );

                  const publicId =
                    getImagePublicId(
                      image as ImageLike
                    );

                  if (!imageUrl) {
                    return null;
                  }

                  return (
                    <div
                      key={
                        publicId ||
                        `${imageUrl}-${index}`
                      }
                      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
                    >
                      <div className="relative aspect-4/3 overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl}
                          alt={imageAlt}
                          fill
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute left-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-medium text-white">
                          {String(
                            index + 1
                          ).padStart(
                            2,
                            "0"
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          void handleDeleteImage(
                            publicId
                          )
                        }
                        disabled={
                          !publicId ||
                          saving
                        }
                        className="w-full border-t border-gray-100 px-3 py-2.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete Image
                      </button>
                    </div>
                  );
                }
              )}
            </div>
          )}

          <div className="mt-6">
            <label
              htmlFor="gallery-images"
              className={`flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition ${
                remainingGallerySlots >
                0
                  ? "cursor-pointer border-gray-300 bg-gray-50 hover:border-gray-500 hover:bg-gray-100"
                  : "cursor-not-allowed border-gray-200 bg-gray-100 opacity-60"
              }`}
            >
              <span className="text-sm font-semibold text-gray-800">
                {remainingGallerySlots >
                0
                  ? "Add gallery images"
                  : "Gallery limit reached"}
              </span>

              <span className="mt-1 text-xs text-gray-500">
                {remainingGallerySlots >
                0
                  ? `${remainingGallerySlots} slot${
                      remainingGallerySlots !==
                      1
                        ? "s"
                        : ""
                    } remaining · JPG, PNG or WEBP`
                  : "Maximum 10 gallery images"}
              </span>

              <input
                id="gallery-images"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                disabled={
                  remainingGallerySlots ===
                  0
                }
                onChange={
                  handleImagesChange
                }
                className="hidden"
              />
            </label>

            {images.length > 0 && (
              <div className="mt-4 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <p className="text-sm font-medium text-gray-800">
                  {images.length} new image
                  {images.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>

                <div className="mt-2 space-y-1">
                  {images.map(
                    (image) => (
                      <p
                        key={`${image.name}-${image.lastModified}`}
                        className="truncate text-xs text-gray-500"
                      >
                        {image.name}
                      </p>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Publishing */}
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="border-b border-gray-100 pb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
              05
            </p>

            <h2 className="mt-1 text-xl font-semibold text-gray-900">
              Publishing
            </h2>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300 hover:bg-white">
              <input
                type="checkbox"
                checked={featured}
                onChange={(event) =>
                  setFeatured(
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300"
              />

              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  Featured project
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  Highlight this project across the
                  website.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:border-gray-300 hover:bg-white">
              <input
                type="checkbox"
                checked={published}
                onChange={(event) =>
                  setPublished(
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-gray-300"
              />

              <span>
                <span className="block text-sm font-semibold text-gray-900">
                  Published
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  Make this project visible publicly.
                </span>
              </span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="sticky bottom-4 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <p className="hidden text-xs text-gray-500 sm:block">
            Changes are saved when you click
            Save Changes.
          </p>

          <div className="ml-auto flex flex-wrap gap-3">
            <Link
              href="/admin/projects"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving Changes..."
                : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}