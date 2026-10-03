import multer from "multer";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const fileFilter: multer.Options["fileFilter"] = (
  _req,
  file,
  cb
) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(
      new Error(
        "Only JPG, PNG and WEBP images are allowed"
      )
    );

    return;
  }

  cb(null, true);
};

export const uploadDesignImages = multer({
  storage,
  fileFilter,

  limits: {
    files: 12,
    fileSize: 5 * 1024 * 1024,
  },
});

export const uploadServiceImage = multer({
  storage,
  fileFilter,

  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024,
  },
});