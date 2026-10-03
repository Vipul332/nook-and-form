import { IProjectImage } from "../../models/Project";
import { deleteProjectImage } from "./project-image.service";

export const cleanupProjectImages = async (
  images: IProjectImage[]
): Promise<void> => {
  if (!images.length) return;

  await Promise.allSettled(
    images.map((image) =>
      deleteProjectImage(image.publicId)
    )
  );
};