import { Express } from "express";
import {
  deleteImage,
  uploadImageBuffer,
} from "./cloudinary.service";

export interface UploadedProjectImage {
  url: string;
  publicId: string;
  alt?: string;
}

export const uploadProjectImage = async (
  file: Express.Multer.File,
  alt?: string
): Promise<UploadedProjectImage> => {
  const result = await uploadImageBuffer(
    file.buffer,
    "interior-design-platform/projects"
  );

  return {
    url: result.url,
    publicId: result.publicId,
    alt: alt?.trim() || undefined,
  };
};

export const deleteProjectImage = async (
  publicId: string
): Promise<void> => {
  await deleteImage(publicId);
};