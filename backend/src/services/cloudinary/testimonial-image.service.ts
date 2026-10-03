import { Express } from "express";
import {
  deleteImage,
  uploadImageBuffer,
} from "./cloudinary.service";

export interface UploadedTestimonialImage {
  url: string;
  publicId: string;
}

export const uploadTestimonialImage = async (
  file: Express.Multer.File
): Promise<UploadedTestimonialImage> => {
  const result = await uploadImageBuffer(
    file.buffer,
    "interior-design-platform/testimonials"
  );

  return {
    url: result.url,
    publicId: result.publicId,
  };
};

export const deleteTestimonialImage = async (
  publicId: string
): Promise<void> => {
  await deleteImage(publicId);
};