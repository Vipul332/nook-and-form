import { IDesignImage } from "../../models/Design";
import { deleteDesignImage } from "./image.service";

export const cleanupDesignImages = async (
  images: IDesignImage[]
): Promise<void> => {
  if (!images.length) {
    return;
  }

  await Promise.allSettled(
    images.map((image) =>
      deleteDesignImage(image.publicId)
    )
  );
};