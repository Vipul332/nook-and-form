import { Express } from "express";
import {
  deleteImage,
  uploadImageBuffer,
} from "./cloudinary.service";

export interface UploadedServiceImage {
  url: string;
  publicId: string;
}

export const uploadServiceImage = async (
  file: Express.Multer.File
): Promise<UploadedServiceImage> => {
  const result = await uploadImageBuffer(
    file.buffer,
    "interior-design-platform/services"
  );

  return {
    url: result.url,
    publicId: result.publicId,
  };
};

export const deleteServiceImage = async (
  publicId: string
): Promise<void> => {
  await deleteImage(publicId);
};