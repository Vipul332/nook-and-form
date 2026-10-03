import Design, {
  IDesign,
  IDesignImage,
} from "../../models/Design";
import {
  CreateDesignInput,
  DesignQueryInput,
  UpdateDesignInput,
} from "../../schemas/design.schema";
import { ApiError } from "../../utils/api-error";
import {
  createPaginationMeta,
  getPagination,
} from "../../utils/pagination";
import {
  cleanupDesignImages,
} from "../cloudinary/image-cleanup.service";
import {
  deleteDesignImage,
  uploadDesignImage,
} from "../cloudinary/image.service";
import { Express } from "express";

const buildFilter = (
  query: DesignQueryInput,
  publicOnly = false
) => {
  const filter: Record<string, unknown> = {};

  if (publicOnly) {
    filter.published = true;
    filter.isArchived = false;
  } else {
    if (query.published !== undefined) {
      filter.published = query.published;
    }

    if (query.archived !== undefined) {
      filter.isArchived = query.archived;
    }
  }

  if (query.roomType) {
    filter.roomType = query.roomType.toLowerCase();
  }

  if (query.style) {
    filter.style = query.style.toLowerCase();
  }

  if (query.color) {
    filter.colors = query.color;
  }

  if (query.material) {
    filter.materials = query.material;
  }

  if (query.featured !== undefined) {
    filter.featured = query.featured;
  }

  if (query.search) {
    filter.$text = {
      $search: query.search,
    };
  }

  return filter;
};

export const createDesign = async (
  data: CreateDesignInput,
  files: Express.Multer.File[] = []
): Promise<IDesign> => {
  const existing = await Design.findOne({
    slug: data.slug,
  });

  if (existing) {
    throw new ApiError(
      409,
      "A design with this slug already exists"
    );
  }

  const uploadedImages: IDesignImage[] = [];

  try {
    for (const file of files) {
      const uploaded = await uploadDesignImage(file);

      uploadedImages.push({
        url: uploaded.url,
        publicId: uploaded.publicId,
        alt: uploaded.alt,
      });
    }

    const design = await Design.create({
      ...data,
      roomType: data.roomType.toLowerCase(),
      style: data.style.toLowerCase(),
      colors: data.colors.map((value) =>
        value.toLowerCase()
      ),
      materials: data.materials.map((value) =>
        value.toLowerCase()
      ),
      tags: data.tags.map((value) =>
        value.toLowerCase()
      ),
      images: uploadedImages,
    });

    return design;
  } catch (error) {
    if (uploadedImages.length) {
      await cleanupDesignImages(uploadedImages);
    }

    throw error;
  }
};

export const getDesigns = async (
  query: DesignQueryInput,
  publicOnly = false
) => {
  const { page, limit } = query;
  const { skip } = getPagination({
    page,
    limit,
  });

  const filter = buildFilter(query, publicOnly);

  const [items, total] = await Promise.all([
    Design.find(filter)
      .sort({
        featured: -1,
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Design.countDocuments(filter),
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

export const getDesignById = async (
  id: string
): Promise<IDesign> => {
  const design = await Design.findById(id);

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  return design;
};

export const getPublicDesignBySlug = async (
  slug: string
): Promise<IDesign> => {
  const design = await Design.findOne({
    slug: slug.toLowerCase(),
    published: true,
    isArchived: false,
  });

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  return design;
};

export const updateDesign = async (
  id: string,
  data: UpdateDesignInput,
  files: Express.Multer.File[] = []
): Promise<IDesign> => {
  const design = await Design.findById(id);

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  if (data.slug && data.slug !== design.slug) {
    const slugExists = await Design.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (slugExists) {
      throw new ApiError(
        409,
        "A design with this slug already exists"
      );
    }
  }

  const uploadedImages: IDesignImage[] = [];

  try {
    for (const file of files) {
      const uploaded = await uploadDesignImage(file);

      uploadedImages.push({
        url: uploaded.url,
        publicId: uploaded.publicId,
        alt: uploaded.alt,
      });
    }

    const updateData: Record<string, unknown> = {
      ...data,
    };

    if (data.roomType) {
      updateData.roomType =
        data.roomType.toLowerCase();
    }

    if (data.style) {
      updateData.style =
        data.style.toLowerCase();
    }

    if (data.colors) {
      updateData.colors = data.colors.map((value) =>
        value.toLowerCase()
      );
    }

    if (data.materials) {
      updateData.materials = data.materials.map(
        (value) => value.toLowerCase()
      );
    }

    if (data.tags) {
      updateData.tags = data.tags.map((value) =>
        value.toLowerCase()
      );
    }

    if (uploadedImages.length) {
      updateData.images = [
        ...design.images,
        ...uploadedImages,
      ];
    }

    Object.assign(design, updateData);

    await design.save();

    return design;
  } catch (error) {
    if (uploadedImages.length) {
      await cleanupDesignImages(uploadedImages);
    }

    throw error;
  }
};

export const deleteDesign = async (
  id: string
): Promise<void> => {
  const design = await Design.findById(id);

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  await cleanupDesignImages(design.images);

  await Design.deleteOne({
    _id: id,
  });
};

export const archiveDesign = async (
  id: string
): Promise<IDesign> => {
  const design = await Design.findByIdAndUpdate(
    id,
    {
      isArchived: true,
      published: false,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  return design;
};

export const publishDesign = async (
  id: string
): Promise<IDesign> => {
  const design = await Design.findById(id);

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  if (design.isArchived) {
    throw new ApiError(
      400,
      "Archived designs cannot be published. Unarchive the design first."
    );
  }

  design.published = true;

  await design.save();

  return design;
};

export const unpublishDesign = async (
  id: string
): Promise<IDesign> => {
  const design = await Design.findByIdAndUpdate(
    id,
    {
      published: false,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  return design;
};

export const unarchiveDesign = async (
  id: string
): Promise<IDesign> => {
  const design = await Design.findByIdAndUpdate(
    id,
    {
      isArchived: false,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  return design;
};

export const removeDesignImage = async (
  designId: string,
  publicId: string
): Promise<IDesign> => {
  const design = await Design.findById(designId);

  if (!design) {
    throw new ApiError(404, "Design not found");
  }

  const imageIndex = design.images.findIndex(
    (image) => image.publicId === publicId
  );

  if (imageIndex === -1) {
    throw new ApiError(
      404,
      "Design image not found"
    );
  }

  const [image] = design.images.splice(
    imageIndex,
    1
  );

  await deleteDesignImage(image.publicId);

  await design.save();

  return design;
};