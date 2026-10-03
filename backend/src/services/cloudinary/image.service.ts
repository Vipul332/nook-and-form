import { Express } from "express";
import {
  deleteImage,
  uploadImageBuffer,
} from "./cloudinary.service";

export interface UploadedDesignImage {
  url: string;
  publicId: string;
  alt?: string;
}

export const uploadDesignImage = async (
  file: Express.Multer.File,
  alt?: string
): Promise<UploadedDesignImage> => {
  const result = await uploadImageBuffer(
    file.buffer,
    "interior-design-platform/designs"
  );

  return {
    url: result.url,
    publicId: result.publicId,
    alt: alt?.trim() || undefined,
  };
};

export const deleteDesignImage = async (
  publicId: string
): Promise<void> => {
  await deleteImage(publicId);
};