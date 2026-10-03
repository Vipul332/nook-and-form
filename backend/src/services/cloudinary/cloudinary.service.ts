import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary";
import { ApiError } from "../../utils/api-error";

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

export const uploadImageBuffer = (
  buffer: Buffer,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          {
            quality: "auto",
            fetch_format: "auto",
          },
        ],
      },
      (
        error: Error | undefined,
        result: UploadApiResponse | undefined
      ) => {
        if (error) {
          reject(
            new ApiError(
              502,
              "Image upload failed",
              error.message
            )
          );

          return;
        }

        if (!result) {
          reject(
            new ApiError(
              502,
              "Cloudinary did not return an upload result"
            )
          );

          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};

export const deleteImage = async (
  publicId: string
): Promise<void> => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
    invalidate: true,
  });
};