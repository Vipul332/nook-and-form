// frontend/src/lib/api.ts

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

/* =========================================================
   TYPES
========================================================= */

/* =========================================================
   DESIGN
========================================================= */

export interface DesignImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface Design {
  _id: string;
  title: string;
  slug: string;
  description: string;
  roomType: string;
  style: string;
  colors: string[];
  materials: string[];
  budgetMin?: number;
  budgetMax?: number;
  tags: string[];
  images: DesignImage[];
  aiEnabled: boolean;
  featured: boolean;
  published: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DesignListData {
  items: Design[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* =========================================================
   PROJECT
========================================================= */

export interface ProjectImage {
  _id?: string;
  url: string;
  publicId?: string;
  alt?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  location?: string;
  category?: string;

  style?: string;
  materials?: string[];

  beforeImage?: string;
  afterImage?: string;

  images: ProjectImage[];

  featured: boolean;

  published: boolean;

  status?: "draft" | "published";

  createdAt: string;
  updatedAt: string;
}

export interface ProjectListData {
  items: Project[];
  projects?: Project[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   SERVICE
========================================================= */

export interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  image?: string;

  startingPrice?: number | string | null;

  features: string[];

  status: "draft" | "published";

  featured: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AdminServiceListData {
  services: Service[];
  items?: Service[];

  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* =========================================================
   ABOUT
========================================================= */

/* -------------------------
   Hero
------------------------- */

export interface AboutHero {
  title: string;
  subtitle: string;
  image?: string;
}

/* -------------------------
   Studio Story
------------------------- */

export interface AboutStudioStory {
  title: string;
  description: string;
  image?: string;
}

/* -------------------------
   Philosophy
------------------------- */

export interface AboutPhilosophy {
  title: string;
  description: string;
}

/* -------------------------
   Principles / Approach
------------------------- */

export interface AboutSection {
  title: string;
  description: string;
  order: number;
}

/* -------------------------
   Design Language
------------------------- */

export interface AboutDesignLanguage {
  title: string;
  description: string;
  images: string[];
}

/* -------------------------
   CTA
------------------------- */

export interface AboutCta {
  title: string;
  description: string;
  buttonText: string;
}

/* -------------------------
   Main About
------------------------- */

export interface About {
  _id: string;

  hero: AboutHero;

  studioStory: AboutStudioStory;

  philosophy: AboutPhilosophy;

  principles: AboutSection[];

  approach: AboutSection[];

  designLanguage: AboutDesignLanguage;

  cta: AboutCta;

  published: boolean;

  createdAt: string;
  updatedAt: string;
}

/* -------------------------
   Create About
------------------------- */

export interface CreateAboutPayload {
  hero: AboutHero;

  studioStory: AboutStudioStory;

  philosophy: AboutPhilosophy;

  principles: AboutSection[];

  approach: AboutSection[];

  designLanguage: AboutDesignLanguage;

  cta: AboutCta;

  published: boolean;
}

/* -------------------------
   Update About
------------------------- */

export type UpdateAboutPayload =
  Partial<CreateAboutPayload>;

/* =========================================================
   TESTIMONIAL
========================================================= */

export interface Testimonial {
  _id: string;

  name: string;

  role?: string;

  rating: number;

  message: string;

  imageUrl?: string;

  published: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface TestimonialListData {
  testimonials: Testimonial[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/* =========================================================
   SETTINGS
========================================================= */

export interface Settings {
  _id: string;

  businessName: string;
  businessEmail: string;
  businessWhatsApp: string;

  phone?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;

  googleMapsUrl?: string;

  instagramUrl?: string;
  facebookUrl?: string;
  telegramUrl?: string;

  officeLatitude?: number;
  officeLongitude?: number;

  createdAt: string;
  updatedAt: string;
}

/* =========================================================
   ADMIN AUTH
========================================================= */

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: AdminUser;
}

export interface AdminMeResponse {
  admin: AdminUser;
}

/* =========================================================
   ADMIN CONSULTATION
========================================================= */

export interface AdminConsultation {
  _id: string;

  name: string;
  email: string;
  phone?: string;

  message?: string;

  consultationType:
    | "PHONE"
    | "WHATSAPP"
    | "ONLINE"
    | "OFFICE_VISIT"
    | "SITE_VISIT";

  status:
    | "NEW"
    | "CONTACTED"
    | "SCHEDULED"
    | "COMPLETED"
    | "CANCELLED";

  location?: string;

  preferredDate?: string;
  preferredTime?: string;

  service?: string;
  budget?: string;

  createdAt: string;
  updatedAt: string;
}

export interface AdminConsultationListData {
  consultations: AdminConsultation[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AdminConsultationQuery {
  status?: AdminConsultation["status"];
  page?: number;
  limit?: number;
}

/* =========================================================
   API RESPONSE
========================================================= */

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  details?: unknown;
}

/* =========================================================
   ADMIN TOKEN
========================================================= */

const ADMIN_TOKEN_KEY = "admin_token";

export const getAdminToken = (): string | null => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const removeAdminToken = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

const getAdminHeaders = (): HeadersInit => {
  const token = getAdminToken();

  return {
    ...(token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {}),
  };
};

/* =========================================================
   RESPONSE HANDLER
========================================================= */

const handleResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  let result: ApiResponse<T>;

  try {
    result = await response.json();
  } catch {
    throw new Error(
      `Request failed with status ${response.status}`
    );
  }

  if (!response.ok) {
    if (response.status === 401) {
      removeAdminToken();
    }

    throw new Error(
      result?.message ||
        `Request failed with status ${response.status}`
    );
  }

  return result;
};

/* =========================================================
   ADMIN AUTH API
========================================================= */

export const adminAuthApi = {
  async login(
    email: string,
    password: string
  ): Promise<ApiResponse<AdminLoginResponse>> {
    const response = await fetch(
      `${API_URL}/admin/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const result =
      await handleResponse<AdminLoginResponse>(
        response
      );

    if (result.data?.token) {
      setAdminToken(result.data.token);
    }

    return result;
  },

  async me(): Promise<ApiResponse<AdminMeResponse>> {
    const response = await fetch(
      `${API_URL}/admin/auth/me`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<AdminMeResponse>(
      response
    );
  },

  isAuthenticated(): boolean {
    return Boolean(getAdminToken());
  },

  logout(): void {
    removeAdminToken();
  },
};

/* =========================================================
   ADMIN DESIGN API
========================================================= */

export const adminDesignApi = {
  async getDesigns(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<DesignListData>> {
    const response = await fetch(
      `${API_URL}/admin/designs?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<DesignListData>(
      response
    );
  },

  async getDesign(
    id: string
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/admin/designs/${id}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<Design>(response);
  },

  async createDesign(
    payload: FormData
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/admin/designs`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: payload,
      }
    );

    return handleResponse<Design>(response);
  },

  async updateDesign(
    id: string,
    payload: FormData
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/admin/designs/${id}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: payload,
      }
    );

    return handleResponse<Design>(response);
  },

  async deleteDesign(
    id: string
  ): Promise<ApiResponse<null>> {
    const response = await fetch(
      `${API_URL}/admin/designs/${id}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<null>(response);
  },

  async archiveDesign(
    id: string
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/admin/designs/${id}/archive`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<Design>(response);
  },

  async unarchiveDesign(
    id: string
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/admin/designs/${id}/unarchive`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<Design>(response);
  },

  async publishDesign(
    id: string
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/admin/designs/${id}/publish`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<Design>(response);
  },

  async unpublishDesign(
    id: string
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/admin/designs/${id}/unpublish`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<Design>(response);
  },

  async deleteDesignImage(
    id: string,
    publicId: string
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/admin/designs/${id}/images`,
      {
        method: "DELETE",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
        }),
      }
    );

    return handleResponse<Design>(response);
  },
};

/* =========================================================
   ADMIN PROJECT API
========================================================= */

export const adminProjectApi = {
  async getProjects(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<ProjectListData>> {
    const response = await fetch(
      `${API_URL}/admin/projects?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<ProjectListData>(
      response
    );
  },

  async getProject(
    id: string
  ): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${API_URL}/admin/projects/${id}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<Project>(response);
  },

  async createProject(
    payload: FormData
  ): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${API_URL}/admin/projects`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: payload,
      }
    );

    return handleResponse<Project>(response);
  },

  async updateProject(
    id: string,
    payload: FormData
  ): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${API_URL}/admin/projects/${id}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: payload,
      }
    );

    return handleResponse<Project>(response);
  },

  async deleteProject(
    id: string
  ): Promise<ApiResponse<null>> {
    const response = await fetch(
      `${API_URL}/admin/projects/${id}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<null>(response);
  },

  async publishProject(
    id: string
  ): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${API_URL}/admin/projects/${id}/publish`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<Project>(response);
  },

  async unpublishProject(
    id: string
  ): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${API_URL}/admin/projects/${id}/unpublish`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<Project>(response);
  },

  async deleteProjectImage(
    id: string,
    publicId: string
  ): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${API_URL}/admin/projects/${id}/images`,
      {
        method: "DELETE",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          publicId,
        }),
      }
    );

    return handleResponse<Project>(response);
  },
};

/* =========================================================
   ADMIN SERVICE API
========================================================= */

export const adminServiceApi = {
  async getServices(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<AdminServiceListData>> {
    const response = await fetch(
      `${API_URL}/admin/services?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<AdminServiceListData>(
      response
    );
  },

  async getService(
    id: string
  ): Promise<ApiResponse<Service>> {
    const response = await fetch(
      `${API_URL}/admin/services/${id}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<Service>(response);
  },

  async createService(
    payload: FormData
  ): Promise<ApiResponse<Service>> {
    const response = await fetch(
      `${API_URL}/admin/services`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: payload,
      }
    );

    return handleResponse<Service>(response);
  },

  async updateService(
    id: string,
    payload: FormData
  ): Promise<ApiResponse<Service>> {
    const response = await fetch(
      `${API_URL}/admin/services`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: payload,
      }
    );

    return handleResponse<Service>(response);
  },

  async deleteService(
    id: string
  ): Promise<ApiResponse<null>> {
    const response = await fetch(
      `${API_URL}/admin/services/${id}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<null>(response);
  },

  async publishService(
    id: string
  ): Promise<ApiResponse<Service>> {
    const response = await fetch(
      `${API_URL}/admin/services/publish`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      }
    );

    return handleResponse<Service>(response);
  },

  async unpublishService(
    id: string
  ): Promise<ApiResponse<Service>> {
    const response = await fetch(
      `${API_URL}/admin/services/unpublish`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
        }),
      }
    );

    return handleResponse<Service>(response);
  },
};

/* =========================================================
   ADMIN ABOUT API
========================================================= */

export const adminAboutApi = {
  async getAbout(): Promise<ApiResponse<About>> {
    const response = await fetch(
      `${API_URL}/admin/about`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<About>(response);
  },

  async createAbout(
    payload: CreateAboutPayload
  ): Promise<ApiResponse<About>> {
    const response = await fetch(
      `${API_URL}/admin/about`,
      {
        method: "POST",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return handleResponse<About>(response);
  },

  async updateAbout(
    payload: UpdateAboutPayload
  ): Promise<ApiResponse<About>> {
    const response = await fetch(
      `${API_URL}/admin/about`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return handleResponse<About>(response);
  },

  async publishAbout(): Promise<ApiResponse<About>> {
    const response = await fetch(
      `${API_URL}/admin/about/publish`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<About>(response);
  },

  async unpublishAbout(): Promise<ApiResponse<About>> {
    const response = await fetch(
      `${API_URL}/admin/about/unpublish`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<About>(response);
  },
};

/* =========================================================
   ADMIN SETTINGS API
========================================================= */

export const adminSettingsApi = {
  async getSettings(): Promise<ApiResponse<Settings>> {
    const response = await fetch(
      `${API_URL}/settings`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<Settings>(response);
  },

  async updateSettings(
    payload: Partial<
      Omit<
        Settings,
        "_id" | "createdAt" | "updatedAt"
      >
    >
  ): Promise<ApiResponse<Settings>> {
    const response = await fetch(
      `${API_URL}/admin/settings`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return handleResponse<Settings>(response);
  },
};

/* =========================================================
   ADMIN CONSULTATION API
========================================================= */

export const adminConsultationApi = {
  async getConsultations(
    params: AdminConsultationQuery = {}
  ): Promise<ApiResponse<AdminConsultationListData>> {
    const searchParams =
      new URLSearchParams();

    if (params.status) {
      searchParams.set(
        "status",
        params.status
      );
    }

    if (params.page !== undefined) {
      searchParams.set(
        "page",
        String(params.page)
      );
    }

    if (params.limit !== undefined) {
      searchParams.set(
        "limit",
        String(params.limit)
      );
    }

    const queryString =
      searchParams.toString();

    const response = await fetch(
      `${API_URL}/admin/consultations${
        queryString
          ? `?${queryString}`
          : ""
      }`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<AdminConsultationListData>(
      response
    );
  },

  async getConsultation(
    id: string
  ): Promise<ApiResponse<AdminConsultation>> {
    const response = await fetch(
      `${API_URL}/admin/consultations/${id}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<AdminConsultation>(
      response
    );
  },

  async updateConsultation(
    id: string,
    payload: Record<string, unknown>
  ): Promise<ApiResponse<AdminConsultation>> {
    const response = await fetch(
      `${API_URL}/admin/consultations/${id}`,
      {
        method: "PATCH",
        headers: {
          ...getAdminHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return handleResponse<AdminConsultation>(
      response
    );
  },

  async deleteConsultation(
    id: string
  ): Promise<ApiResponse<null>> {
    const response = await fetch(
      `${API_URL}/admin/consultations/${id}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<null>(response);
  },
};

/* =========================================================
   ADMIN TESTIMONIAL API
========================================================= */

export const adminTestimonialApi = {
  async getTestimonials(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<TestimonialListData>> {
    const response = await fetch(
      `${API_URL}/admin/testimonials?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<TestimonialListData>(
      response
    );
  },

  async getTestimonial(
    id: string
  ): Promise<ApiResponse<Testimonial>> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${id}`,
      {
        method: "GET",
        headers: getAdminHeaders(),
        cache: "no-store",
      }
    );

    return handleResponse<Testimonial>(
      response
    );
  },

  async createTestimonial(
    payload: FormData
  ): Promise<ApiResponse<Testimonial>> {
    const response = await fetch(
      `${API_URL}/admin/testimonials`,
      {
        method: "POST",
        headers: getAdminHeaders(),
        body: payload,
      }
    );

    return handleResponse<Testimonial>(
      response
    );
  },

  async updateTestimonial(
    id: string,
    payload: FormData
  ): Promise<ApiResponse<Testimonial>> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${id}`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
        body: payload,
      }
    );

    return handleResponse<Testimonial>(
      response
    );
  },

  async deleteTestimonial(
    id: string
  ): Promise<ApiResponse<null>> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${id}`,
      {
        method: "DELETE",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<null>(response);
  },

  async publishTestimonial(
    id: string
  ): Promise<ApiResponse<Testimonial>> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${id}/publish`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<Testimonial>(
      response
    );
  },

  async unpublishTestimonial(
    id: string
  ): Promise<ApiResponse<Testimonial>> {
    const response = await fetch(
      `${API_URL}/admin/testimonials/${id}/unpublish`,
      {
        method: "PATCH",
        headers: getAdminHeaders(),
      }
    );

    return handleResponse<Testimonial>(
      response
    );
  },
};

/* =========================================================
   PUBLIC TESTIMONIAL API
========================================================= */

export const publicTestimonialApi = {
  async getTestimonials(): Promise<
    ApiResponse<Testimonial[]>
  > {
    const response = await fetch(
      `${API_URL}/testimonials`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<Testimonial[]>(
      response
    );
  },
};

/* =========================================================
   PUBLIC DESIGN API
========================================================= */

export interface PublicDesignQuery {
  page?: number;
  limit?: number;
  search?: string;
  roomType?: string;
  style?: string;
}

export const publicDesignApi = {
  async getDesigns(
    params: PublicDesignQuery = {}
  ): Promise<ApiResponse<DesignListData>> {
    const searchParams =
      new URLSearchParams();

    if (params.page !== undefined) {
      searchParams.set(
        "page",
        String(params.page)
      );
    }

    if (params.limit !== undefined) {
      searchParams.set(
        "limit",
        String(params.limit)
      );
    }

    if (params.search) {
      searchParams.set(
        "search",
        params.search
      );
    }

    if (params.roomType) {
      searchParams.set(
        "roomType",
        params.roomType
      );
    }

    if (params.style) {
      searchParams.set(
        "style",
        params.style
      );
    }

    const queryString =
      searchParams.toString();

    const response = await fetch(
      `${API_URL}/designs${
        queryString
          ? `?${queryString}`
          : ""
      }`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<DesignListData>(
      response
    );
  },

  async getDesign(
    slug: string
  ): Promise<ApiResponse<Design>> {
    const response = await fetch(
      `${API_URL}/designs/${slug}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<Design>(response);
  },

  async getDesignBySlug(
    slug: string
  ): Promise<ApiResponse<Design>> {
    return this.getDesign(slug);
  },
};

/* =========================================================
   PUBLIC PROJECT API
========================================================= */

export const publicProjectApi = {
  async getProjects(): Promise<
    ApiResponse<ProjectListData>
  > {
    const response = await fetch(
      `${API_URL}/projects`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<ProjectListData>(
      response
    );
  },

  async getProject(
    slug: string
  ): Promise<ApiResponse<Project>> {
    const response = await fetch(
      `${API_URL}/projects/${slug}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<Project>(response);
  },

  async getProjectBySlug(
    slug: string
  ): Promise<ApiResponse<Project>> {
    return this.getProject(slug);
  },
};

/* =========================================================
   PUBLIC SERVICE API
========================================================= */

export const publicServiceApi = {
  async getServices(): Promise<
    ApiResponse<AdminServiceListData>
  > {
    const response = await fetch(
      `${API_URL}/services`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<AdminServiceListData>(
      response
    );
  },

  async getService(
    slug: string
  ): Promise<ApiResponse<Service>> {
    const response = await fetch(
      `${API_URL}/services/${slug}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<Service>(response);
  },

  async getServiceBySlug(
    slug: string
  ): Promise<ApiResponse<Service>> {
    return this.getService(slug);
  },
};

/* =========================================================
   PUBLIC ABOUT API
========================================================= */

export const publicAboutApi = {
  async getAbout(): Promise<ApiResponse<About>> {
    const response = await fetch(
      `${API_URL}/about`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    return handleResponse<About>(response);
  },
};

/* =========================================================
   PUBLIC CONSULTATION API
========================================================= */

export interface CreateConsultationPayload {
  name: string;
  email: string;
  phone: string;

  consultationType:
    | "PHONE"
    | "WHATSAPP"
    | "ONLINE"
    | "OFFICE_VISIT"
    | "SITE_VISIT";

  preferredDate?: string;
  preferredTime?: string;
  location?: string;
  message?: string;
  service?: string;
  budget?: string;
}

export const publicConsultationApi = {
  async createConsultation(
    payload: CreateConsultationPayload
  ): Promise<ApiResponse<unknown>> {
    const response = await fetch(
      `${API_URL}/consultations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    return handleResponse<unknown>(response);
  },
};