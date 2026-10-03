"use client";

import {
  useEffect,
  useReducer,
  useState,
} from "react";

import type { FormEvent } from "react";

import type {
  About,
  AboutSection,
  CreateAboutPayload,
} from "@/lib/api";

import { adminAboutApi } from "@/lib/api";

type AboutFormData = {
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  studioStory: {
    title: string;
    description: string;
    image: string;
  };
  philosophy: {
    title: string;
    description: string;
  };
  principles: AboutSection[];
  approach: AboutSection[];
  designLanguage: {
    title: string;
    description: string;
    images: string[];
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  published: boolean;
};

type PageState = {
  about: About | null;
  form: AboutFormData;
  loading: boolean;
  saving: boolean;
  publishing: boolean;
  error: string;
  success: string;
};

type PageAction =
  | {
      type: "LOAD_SUCCESS";
      about: About | null;
      form: AboutFormData;
    }
  | {
      type: "LOAD_ERROR";
      message: string;
    }
  | {
      type: "SAVE_START";
    }
  | {
      type: "SAVE_SUCCESS";
      about: About;
    }
  | {
      type: "SAVE_ERROR";
      message: string;
    }
  | {
      type: "PUBLISH_START";
    }
  | {
      type: "PUBLISH_SUCCESS";
      about: About;
      message: string;
    }
  | {
      type: "PUBLISH_ERROR";
      message: string;
    }
  | {
      type: "SET_FORM";
      form: AboutFormData;
    }
  | {
      type: "CLEAR_MESSAGES";
    };

const initialForm: AboutFormData = {
  hero: {
    title: "",
    subtitle: "",
    image: "",
  },
  studioStory: {
    title: "",
    description: "",
    image: "",
  },
  philosophy: {
    title: "",
    description: "",
  },
  principles: [],
  approach: [],
  designLanguage: {
    title: "",
    description: "",
    images: [],
  },
  cta: {
    title: "",
    description: "",
    buttonText: "",
  },
  published: false,
};

const initialPageState: PageState = {
  about: null,
  form: initialForm,
  loading: true,
  saving: false,
  publishing: false,
  error: "",
  success: "",
};

function normalizeAbout(about: About): AboutFormData {
  return {
    hero: {
      title: about.hero?.title ?? "",
      subtitle: about.hero?.subtitle ?? "",
      image: about.hero?.image ?? "",
    },

    studioStory: {
      title: about.studioStory?.title ?? "",
      description: about.studioStory?.description ?? "",
      image: about.studioStory?.image ?? "",
    },

    philosophy: {
      title: about.philosophy?.title ?? "",
      description: about.philosophy?.description ?? "",
    },

    principles: [...(about.principles ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        title: item.title ?? "",
        description: item.description ?? "",
        order: item.order ?? 0,
      })),

    approach: [...(about.approach ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((item) => ({
        title: item.title ?? "",
        description: item.description ?? "",
        order: item.order ?? 0,
      })),

    designLanguage: {
      title: about.designLanguage?.title ?? "",
      description: about.designLanguage?.description ?? "",
      images: [...(about.designLanguage?.images ?? [])],
    },

    cta: {
      title: about.cta?.title ?? "",
      description: about.cta?.description ?? "",
      buttonText: about.cta?.buttonText ?? "",
    },

    published: Boolean(about.published),
  };
}

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (typeof error === "object" && error !== null) {
    const apiError = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    return (
      apiError.response?.data?.message ||
      apiError.message ||
      fallback
    );
  }

  if (typeof error === "string") {
    return error;
  }

  return fallback;
}

function aboutReducer(
  state: PageState,
  action: PageAction
): PageState {
  switch (action.type) {
    case "LOAD_SUCCESS":
      return {
        ...state,
        loading: false,
        about: action.about,
        form: action.form,
        error: "",
      };

    case "LOAD_ERROR":
      return {
        ...state,
        loading: false,
        error: action.message,
      };

    case "SAVE_START":
      return {
        ...state,
        saving: true,
        error: "",
        success: "",
      };

    case "SAVE_SUCCESS":
      return {
        ...state,
        saving: false,
        about: action.about,
        form: normalizeAbout(action.about),
        error: "",
        success: "About content saved successfully.",
      };

    case "SAVE_ERROR":
      return {
        ...state,
        saving: false,
        error: action.message,
        success: "",
      };

    case "PUBLISH_START":
      return {
        ...state,
        publishing: true,
        error: "",
        success: "",
      };

    case "PUBLISH_SUCCESS":
      return {
        ...state,
        publishing: false,
        about: action.about,
        form: normalizeAbout(action.about),
        error: "",
        success: action.message,
      };

    case "PUBLISH_ERROR":
      return {
        ...state,
        publishing: false,
        error: action.message,
        success: "",
      };

    case "SET_FORM":
      return {
        ...state,
        form: action.form,
      };

    case "CLEAR_MESSAGES":
      return {
        ...state,
        error: "",
        success: "",
      };

    default:
      return state;
  }
}

export default function AdminAboutPage() {
  const [state, dispatch] = useReducer(
    aboutReducer,
    initialPageState
  );

  const {
    about,
    form,
    loading,
    saving,
    publishing,
    error,
    success,
  } = state;

  const [activeTab, setActiveTab] = useState<
    "content" | "principles" | "approach"
  >("content");

  useEffect(() => {
    let cancelled = false;

    const fetchAbout = async () => {
      try {
        const response = await adminAboutApi.getAbout();

        if (cancelled) {
          return;
        }

        if (response?.data) {
          dispatch({
            type: "LOAD_SUCCESS",
            about: response.data,
            form: normalizeAbout(response.data),
          });
        } else {
          dispatch({
            type: "LOAD_SUCCESS",
            about: null,
            form: initialForm,
          });
        }
      } catch (err: unknown) {
        if (cancelled) {
          return;
        }

        dispatch({
          type: "LOAD_ERROR",
          message: getErrorMessage(
            err,
            "Failed to load About content."
          ),
        });
      }
    };

    void fetchAbout();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateForm = (
    updater: (current: AboutFormData) => AboutFormData
  ) => {
    dispatch({
      type: "SET_FORM",
      form: updater(form),
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    dispatch({
      type: "SAVE_START",
    });

    try {
      const payload: CreateAboutPayload = {
        hero: {
          title: form.hero.title.trim(),
          subtitle: form.hero.subtitle.trim(),
          image:
            form.hero.image.trim() || undefined,
        },

        studioStory: {
          title: form.studioStory.title.trim(),
          description:
            form.studioStory.description.trim(),
          image:
            form.studioStory.image.trim() || undefined,
        },

        philosophy: {
          title: form.philosophy.title.trim(),
          description:
            form.philosophy.description.trim(),
        },

        principles: form.principles.map(
          (item, index) => ({
            title: item.title.trim(),
            description:
              item.description.trim(),
            order: index + 1,
          })
        ),

        approach: form.approach.map(
          (item, index) => ({
            title: item.title.trim(),
            description:
              item.description.trim(),
            order: index + 1,
          })
        ),

        designLanguage: {
          title:
            form.designLanguage.title.trim(),
          description:
            form.designLanguage.description.trim(),
          images:
            form.designLanguage.images
              .map((image) => image.trim())
              .filter(Boolean),
        },

        cta: {
          title: form.cta.title.trim(),
          description:
            form.cta.description.trim(),
          buttonText:
            form.cta.buttonText.trim(),
        },

        published: form.published,
      };

      let response;

      if (about) {
        response =
          await adminAboutApi.updateAbout(
            payload
          );
      } else {
        response =
          await adminAboutApi.createAbout(
            payload
          );
      }

      if (!response?.data) {
        throw new Error(
          "About content was saved but no data was returned."
        );
      }

      dispatch({
        type: "SAVE_SUCCESS",
        about: response.data,
      });
    } catch (err: unknown) {
      dispatch({
        type: "SAVE_ERROR",
        message: getErrorMessage(
          err,
          "Failed to save About content."
        ),
      });
    }
  };

  const handlePublishToggle = async () => {
    dispatch({
      type: "PUBLISH_START",
    });

    try {
      const response = form.published
        ? await adminAboutApi.unpublishAbout()
        : await adminAboutApi.publishAbout();

      if (!response?.data) {
        throw new Error(
          "No About data was returned from the server."
        );
      }

      dispatch({
        type: "PUBLISH_SUCCESS",
        about: response.data,
        message: form.published
          ? "About content unpublished successfully."
          : "About content published successfully.",
      });
    } catch (err: unknown) {
      dispatch({
        type: "PUBLISH_ERROR",
        message: getErrorMessage(
          err,
          "Failed to update publication status."
        ),
      });
    }
  };

  const addPrinciple = () => {
    updateForm((current) => ({
      ...current,
      principles: [
        ...current.principles,
        {
          title: "",
          description: "",
          order:
            current.principles.length + 1,
        },
      ],
    }));
  };

  const removePrinciple = (index: number) => {
    updateForm((current) => ({
      ...current,
      principles: current.principles
        .filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
        .map((item, itemIndex) => ({
          ...item,
          order: itemIndex + 1,
        })),
    }));
  };

  const updatePrinciple = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    updateForm((current) => ({
      ...current,
      principles:
        current.principles.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }));
  };

  const addApproach = () => {
    updateForm((current) => ({
      ...current,
      approach: [
        ...current.approach,
        {
          title: "",
          description: "",
          order:
            current.approach.length + 1,
        },
      ],
    }));
  };

  const removeApproach = (index: number) => {
    updateForm((current) => ({
      ...current,
      approach: current.approach
        .filter(
          (_, itemIndex) =>
            itemIndex !== index
        )
        .map((item, itemIndex) => ({
          ...item,
          order: itemIndex + 1,
        })),
    }));
  };

  const updateApproach = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    updateForm((current) => ({
      ...current,
      approach:
        current.approach.map(
          (item, itemIndex) =>
            itemIndex === index
              ? {
                  ...item,
                  [field]: value,
                }
              : item
        ),
    }));
  };

  const addDesignImage = () => {
    updateForm((current) => ({
      ...current,
      designLanguage: {
        ...current.designLanguage,
        images: [
          ...current.designLanguage.images,
          "",
        ],
      },
    }));
  };

  const removeDesignImage = (
    index: number
  ) => {
    updateForm((current) => ({
      ...current,
      designLanguage: {
        ...current.designLanguage,
        images:
          current.designLanguage.images.filter(
            (_, imageIndex) =>
              imageIndex !== index
          ),
      },
    }));
  };

  const updateDesignImage = (
    index: number,
    value: string
  ) => {
    updateForm((current) => ({
      ...current,
      designLanguage: {
        ...current.designLanguage,
        images:
          current.designLanguage.images.map(
            (image, imageIndex) =>
              imageIndex === index
                ? value
                : image
          ),
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2ec] px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-[#dcd5ca] bg-[#fbfaf7] p-10">
            <div className="h-8 w-56 animate-pulse rounded bg-[#e7e1d7]" />

            <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded bg-[#e7e1d7]" />

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="h-32 animate-pulse rounded-2xl bg-[#e7e1d7]" />
              <div className="h-32 animate-pulse rounded-2xl bg-[#e7e1d7]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f2ec] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <header className="mb-8 flex flex-col gap-5 border-b border-[#d8d1c6] pb-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#8b8174]">
              Content Management
            </p>

            <h1 className="font-serif text-4xl tracking-[-0.03em] text-[#27231f] sm:text-5xl">
              About Studio
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#756d63]">
              Manage the public About page, studio
              philosophy, principles, approach,
              design language and consultation
              call-to-action.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.15em] ${
                form.published
                  ? "border-[#b9c9b5] bg-[#eef4ec] text-[#52664e]"
                  : "border-[#d8d0c5] bg-[#f0ece5] text-[#83796d]"
              }`}
            >
              {form.published
                ? "Published"
                : "Draft"}
            </div>

            <button
              type="button"
              onClick={handlePublishToggle}
              disabled={
                publishing || !about
              }
              className="rounded-full border border-[#312d28] bg-[#312d28] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#48423b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishing
                ? "Updating..."
                : form.published
                  ? "Unpublish"
                  : "Publish"}
            </button>
          </div>
        </header>

        {/* ALERTS */}
        {error && (
          <div className="mb-6 rounded-2xl border border-[#e2b9b2] bg-[#fff5f3] px-5 py-4 text-sm text-[#8a443a]">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-2xl border border-[#c4d4bf] bg-[#f1f7ef] px-5 py-4 text-sm text-[#53674d]">
            {success}
          </div>
        )}

        {/* TABS */}
        <div className="mb-8 flex gap-2 overflow-x-auto border-b border-[#d8d1c6]">
          <button
            type="button"
            onClick={() =>
              setActiveTab("content")
            }
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
              activeTab === "content"
                ? "border-[#312d28] text-[#312d28]"
                : "border-transparent text-[#8b8174] hover:text-[#312d28]"
            }`}
          >
            Main Content
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("principles")
            }
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
              activeTab === "principles"
                ? "border-[#312d28] text-[#312d28]"
                : "border-transparent text-[#8b8174] hover:text-[#312d28]"
            }`}
          >
            Principles
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("approach")
            }
            className={`whitespace-nowrap border-b-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
              activeTab === "approach"
                ? "border-[#312d28] text-[#312d28]"
                : "border-transparent text-[#8b8174] hover:text-[#312d28]"
            }`}
          >
            Approach
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* MAIN CONTENT */}
          {activeTab === "content" && (
            <div className="space-y-8">
              {/* HERO */}
              <section className="rounded-3xl border border-[#d8d1c6] bg-[#fbfaf7] p-6 sm:p-8">
                <div className="mb-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a8f81]">
                    01
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#302b26]">
                    Hero
                  </h2>

                  <p className="mt-2 text-sm text-[#7b7268]">
                    The opening section visitors see
                    on the About page.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Field
                    label="Title"
                    value={form.hero.title}
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          title: value,
                        },
                      }))
                    }
                    placeholder="Spaces Designed Around You"
                  />

                  <Field
                    label="Image URL"
                    value={form.hero.image}
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          image: value,
                        },
                      }))
                    }
                    placeholder="https://..."
                  />

                  <TextArea
                    label="Subtitle"
                    value={form.hero.subtitle}
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          subtitle: value,
                        },
                      }))
                    }
                    placeholder="Thoughtfully designed interiors..."
                    className="lg:col-span-2"
                  />
                </div>
              </section>

              {/* STUDIO STORY */}
              <section className="rounded-3xl border border-[#d8d1c6] bg-[#fbfaf7] p-6 sm:p-8">
                <div className="mb-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a8f81]">
                    02
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#302b26]">
                    Studio Story
                  </h2>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Field
                    label="Title"
                    value={
                      form.studioStory.title
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        studioStory: {
                          ...current.studioStory,
                          title: value,
                        },
                      }))
                    }
                    placeholder="Designing Spaces With Purpose"
                  />

                  <Field
                    label="Image URL"
                    value={
                      form.studioStory.image
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        studioStory: {
                          ...current.studioStory,
                          image: value,
                        },
                      }))
                    }
                    placeholder="https://..."
                  />

                  <TextArea
                    label="Description"
                    value={
                      form.studioStory.description
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        studioStory: {
                          ...current.studioStory,
                          description: value,
                        },
                      }))
                    }
                    placeholder="Tell visitors about the studio..."
                    className="lg:col-span-2"
                    rows={7}
                  />
                </div>
              </section>

              {/* PHILOSOPHY */}
              <section className="rounded-3xl border border-[#d8d1c6] bg-[#fbfaf7] p-6 sm:p-8">
                <div className="mb-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a8f81]">
                    03
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#302b26]">
                    Philosophy
                  </h2>
                </div>

                <div className="space-y-6">
                  <Field
                    label="Title"
                    value={
                      form.philosophy.title
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        philosophy: {
                          ...current.philosophy,
                          title: value,
                        },
                      }))
                    }
                    placeholder="Design With Purpose"
                  />

                  <TextArea
                    label="Description"
                    value={
                      form.philosophy.description
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        philosophy: {
                          ...current.philosophy,
                          description: value,
                        },
                      }))
                    }
                    placeholder="Explain the studio's design philosophy..."
                    rows={7}
                  />
                </div>
              </section>

              {/* DESIGN LANGUAGE */}
              <section className="rounded-3xl border border-[#d8d1c6] bg-[#fbfaf7] p-6 sm:p-8">
                <div className="mb-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a8f81]">
                    04
                  </p>

                  <h2 className="mt-2 font-serif text-2xl text-[#302b26]">
                    Design Language
                  </h2>
                </div>

                <div className="space-y-6">
                  <Field
                    label="Title"
                    value={
                      form.designLanguage.title
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        designLanguage: {
                          ...current.designLanguage,
                          title: value,
                        },
                      }))
                    }
                    placeholder="A Distinct Design Language"
                  />

                  <TextArea
                    label="Description"
                    value={
                      form.designLanguage
                        .description
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        designLanguage: {
                          ...current.designLanguage,
                          description: value,
                        },
                      }))
                    }
                    placeholder="Describe the visual language..."
                    rows={6}
                  />

                  <div>
                    <div className="mb-3 flex items-center justify-between">
                      <label className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#766d63]">
                        Images
                      </label>

                      <button
                        type="button"
                        onClick={addDesignImage}
                        className="rounded-full border border-[#bdb4a8] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#514a43] transition hover:border-[#312d28] hover:bg-[#f3efe8]"
                      >
                        + Add Image
                      </button>
                    </div>

                    <div className="space-y-3">
                      {form.designLanguage
                        .images.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-[#cfc7bb] px-5 py-8 text-center text-sm text-[#91877c]">
                          No design-language
                          images added yet.
                        </div>
                      ) : (
                        form.designLanguage.images.map(
                          (image, index) => (
                            <div
                              key={`design-image-${index}`}
                              className="flex gap-3"
                            >
                              <input
                                type="url"
                                value={image}
                                onChange={(event) =>
                                  updateDesignImage(
                                    index,
                                    event.target.value
                                  )
                                }
                                placeholder="https://..."
                                className="min-w-0 flex-1 rounded-xl border border-[#d4ccc0] bg-white px-4 py-3 text-sm text-[#332e29] outline-none transition focus:border-[#74695d] focus:ring-2 focus:ring-[#74695d]/10"
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  removeDesignImage(
                                    index
                                  )
                                }
                                className="rounded-xl border border-[#e0c7c2] px-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9a554b] transition hover:bg-[#fff4f2]"
                              >
                                Remove
                              </button>
                            </div>
                          )
                        )
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA */}
              <section className="rounded-3xl bg-[#302c27] p-6 text-white sm:p-8">
                <div className="mb-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#a99d8e]">
                    05
                  </p>

                  <h2 className="mt-2 font-serif text-2xl">
                    Final CTA
                  </h2>

                  <p className="mt-2 text-sm text-[#c5bdb2]">
                    The final invitation for visitors
                    to start a conversation.
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <DarkField
                    label="Title"
                    value={form.cta.title}
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        cta: {
                          ...current.cta,
                          title: value,
                        },
                      }))
                    }
                    placeholder="Let's Create Your Space"
                  />

                  <DarkField
                    label="Button Text"
                    value={
                      form.cta.buttonText
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        cta: {
                          ...current.cta,
                          buttonText: value,
                        },
                      }))
                    }
                    placeholder="Schedule an Appointment"
                  />

                  <DarkTextArea
                    label="Description"
                    value={
                      form.cta.description
                    }
                    onChange={(value) =>
                      updateForm((current) => ({
                        ...current,
                        cta: {
                          ...current.cta,
                          description: value,
                        },
                      }))
                    }
                    placeholder="Tell us about your space..."
                    className="lg:col-span-2"
                  />
                </div>
              </section>
            </div>
          )}

          {/* PRINCIPLES */}
          {activeTab === "principles" && (
            <section className="rounded-3xl border border-[#d8d1c6] bg-[#fbfaf7] p-6 sm:p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a8f81]">
                    Studio Philosophy
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-[#302b26]">
                    Principles
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#7b7268]">
                    Add the principles that define
                    how the studio approaches every
                    project.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addPrinciple}
                  className="rounded-full bg-[#302c27] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#49423a]"
                >
                  + Add Principle
                </button>
              </div>

              <div className="space-y-5">
                {form.principles.length ===
                0 ? (
                  <EmptyState
                    text="No principles added yet."
                    buttonText="Add First Principle"
                    onClick={addPrinciple}
                  />
                ) : (
                  form.principles.map(
                    (principle, index) => (
                      <div
                        key={`principle-${index}`}
                        className="rounded-2xl border border-[#d8d1c6] bg-[#f7f4ee] p-5"
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <span className="font-serif text-xl text-[#8e8171]">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removePrinciple(
                                index
                              )
                            }
                            className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a554b] hover:text-[#743d35]"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-2">
                          <Field
                            label="Title"
                            value={
                              principle.title
                            }
                            onChange={(value) =>
                              updatePrinciple(
                                index,
                                "title",
                                value
                              )
                            }
                            placeholder="Listen First"
                          />

                          <TextArea
                            label="Description"
                            value={
                              principle.description
                            }
                            onChange={(value) =>
                              updatePrinciple(
                                index,
                                "description",
                                value
                              )
                            }
                            placeholder="Describe this principle..."
                            rows={4}
                          />
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </section>
          )}

          {/* APPROACH */}
          {activeTab === "approach" && (
            <section className="rounded-3xl border border-[#d8d1c6] bg-[#fbfaf7] p-6 sm:p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a8f81]">
                    Design Process
                  </p>

                  <h2 className="mt-2 font-serif text-3xl text-[#302b26]">
                    Approach
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[#7b7268]">
                    Define the stages clients move
                    through during the design journey.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addApproach}
                  className="rounded-full bg-[#302c27] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#49423a]"
                >
                  + Add Step
                </button>
              </div>

              <div className="space-y-5">
                {form.approach.length ===
                0 ? (
                  <EmptyState
                    text="No approach steps added yet."
                    buttonText="Add First Step"
                    onClick={addApproach}
                  />
                ) : (
                  form.approach.map(
                    (step, index) => (
                      <div
                        key={`approach-${index}`}
                        className="rounded-2xl border border-[#d8d1c6] bg-[#f7f4ee] p-5"
                      >
                        <div className="mb-5 flex items-center justify-between">
                          <span className="font-serif text-xl text-[#8e8171]">
                            {String(
                              index + 1
                            ).padStart(2, "0")}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeApproach(
                                index
                              )
                            }
                            className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9a554b] hover:text-[#743d35]"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid gap-5 lg:grid-cols-2">
                          <Field
                            label="Title"
                            value={step.title}
                            onChange={(value) =>
                              updateApproach(
                                index,
                                "title",
                                value
                              )
                            }
                            placeholder="Understand"
                          />

                          <TextArea
                            label="Description"
                            value={
                              step.description
                            }
                            onChange={(value) =>
                              updateApproach(
                                index,
                                "description",
                                value
                              )
                            }
                            placeholder="Describe this stage..."
                            rows={4}
                          />
                        </div>
                      </div>
                    )
                  )
                )}
              </div>
            </section>
          )}

          {/* SAVE BAR */}
          <div className="sticky bottom-4 z-20 mt-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#d2c9bd] bg-[#fbfaf7]/95 p-4 shadow-[0_15px_50px_rgba(50,42,34,0.12)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8b8174]">
                  About Page
                </p>

                <p className="mt-1 text-xs text-[#766d63]">
                  Save your changes before
                  publishing the page.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#302c27] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#49423a] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Saving Changes..."
                  : about
                    ? "Save Changes"
                    : "Create About Page"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* REUSABLE COMPONENTS                                                        */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.17em] text-[#766d63]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#d4ccc0] bg-white px-4 py-3.5 text-sm text-[#332e29] outline-none transition placeholder:text-[#aaa095] focus:border-[#74695d] focus:ring-2 focus:ring-[#74695d]/10"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.17em] text-[#766d63]">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-[#d4ccc0] bg-white px-4 py-3.5 text-sm leading-6 text-[#332e29] outline-none transition placeholder:text-[#aaa095] focus:border-[#74695d] focus:ring-2 focus:ring-[#74695d]/10"
      />
    </div>
  );
}

function DarkField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.17em] text-[#b6ab9d]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#5a5249] bg-[#3a352f] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-[#82786c] focus:border-[#a99b8a] focus:ring-2 focus:ring-[#b6a894]/10"
      />
    </div>
  );
}

function DarkTextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.17em] text-[#b6ab9d]">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border border-[#5a5249] bg-[#3a352f] px-4 py-3.5 text-sm leading-6 text-white outline-none transition placeholder:text-[#82786c] focus:border-[#a99b8a] focus:ring-2 focus:ring-[#b6a894]/10"
      />
    </div>
  );
}

function EmptyState({
  text,
  buttonText,
  onClick,
}: {
  text: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#cfc7bb] px-6 py-12 text-center">
      <p className="text-sm text-[#91877c]">
        {text}
      </p>

      <button
        type="button"
        onClick={onClick}
        className="mt-4 rounded-full border border-[#bdb4a8] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#514a43] transition hover:border-[#312d28] hover:bg-[#f3efe8]"
      >
        {buttonText}
      </button>
    </div>
  );
}