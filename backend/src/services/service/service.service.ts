
import mongoose from "mongoose";
import Service, { IService } from "../../models/Service";
import {
  CreateServiceInput,
  ServiceQueryInput,
  UpdateServiceInput,
} from "../../schemas/service.schema";
import { ApiError } from "../../utils/api-error";
import {
  createPaginationMeta,
  getPagination,
} from "../../utils/pagination";

/* =========================================================
   Find Service By MongoDB ID
========================================================= */

const findServiceOrThrow = async (
  id: string
): Promise<IService> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid service ID");
  }

  const service = await Service.findById(id);

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

/* =========================================================
   Create Service
========================================================= */

export const createService = async (
  data: CreateServiceInput
): Promise<IService> => {
  const slug = data.slug.trim().toLowerCase();

  const existing = await Service.findOne({ slug });

  if (existing) {
    throw new ApiError(
      409,
      "A service with this slug already exists"
    );
  }

 return Service.create({
  title: data.name.trim(),
  slug,
  shortDescription: data.shortDescription?.trim() ?? "",
  description: data.description.trim(),
  image: data.image,
  startingPrice: data.startingPrice,
  featured: data.featured ?? false,
  published: data.status === "published",
});
};

/* =========================================================
   Get Services
========================================================= */

export const getServices = async (
  query: ServiceQueryInput,
  publicOnly = false
) => {
  const { page, limit } = query;

  const { skip } = getPagination({
    page,
    limit,
  });

  const filter: Record<string, unknown> = {};

  if (publicOnly) {
    filter.published = true;
  } else if (query.status !== undefined) {
    filter.published = query.status === "published";
  }

  if (query.featured !== undefined) {
    filter.featured = query.featured;
  }

  if (query.search) {
    const search = query.search.trim();

    filter.$or = [
      {
        title: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        shortDescription: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [items, total] = await Promise.all([
    Service.find(filter)
      .sort({
        featured: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Service.countDocuments(filter),
  ]);

  return {
    items,
    pagination: createPaginationMeta(
      page,
      limit,
      total
    ),
  };
};

/* =========================================================
   Get Service By ID
========================================================= */

export const getServiceById = async (
  id: string
): Promise<IService> => {
  return findServiceOrThrow(id);
};

/* =========================================================
   Get Public Service By Slug
========================================================= */

export const getPublicServiceBySlug = async (
  slug: string
): Promise<IService> => {
  const normalizedSlug = slug.trim().toLowerCase();

  const service = await Service.findOne({
    slug: normalizedSlug,
    published: true,
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  return service;
};

/* =========================================================
   Update Service
========================================================= */

export const updateService = async (
  id: string,
  data: UpdateServiceInput
): Promise<IService> => {
  const service = await findServiceOrThrow(id);

  if (data.slug !== undefined) {
    const normalizedSlug = data.slug.trim().toLowerCase();

    const slugExists = await Service.findOne({
      slug: normalizedSlug,
      _id: { $ne: service._id },
    });

    if (slugExists) {
      throw new ApiError(
        409,
        "A service with this slug already exists"
      );
    }

    service.slug = normalizedSlug;
  }

  if (data.name !== undefined) {
    service.title = data.name.trim();
  }

  if (data.shortDescription !== undefined) {
    service.shortDescription =
      data.shortDescription.trim();
  }

  if (data.description !== undefined) {
    service.description = data.description.trim();
  }

  if (data.image !== undefined) {
    service.image = data.image;
  }

  if (data.featured !== undefined) {
    service.featured = data.featured;
  }

  if (data.status !== undefined) {
    service.published = data.status === "published";
  }
if (data.startingPrice !== undefined) {
  service.startingPrice = data.startingPrice;
}
  await service.save();

  return service;
};

/* =========================================================
   Delete Service
========================================================= */

export const deleteService = async (
  id: string
): Promise<void> => {
  const service = await findServiceOrThrow(id);

  await Service.deleteOne({
    _id: service._id,
  });
};

/* =========================================================
   Publish Service
========================================================= */

export const publishService = async (
  id: string
): Promise<IService> => {
  const service = await findServiceOrThrow(id);

  service.published = true;

  await service.save();

  return service;
};

/* =========================================================
   Unpublish Service
========================================================= */

export const unpublishService = async (
  id: string
): Promise<IService> => {
  const service = await findServiceOrThrow(id);

  service.published = false;

  await service.save();

  return service;
};