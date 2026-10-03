import { Document, Model, Schema, model } from "mongoose";

export interface IGallery extends Document {
  title?: string;
  imageUrl: string;
  publicId: string;
  category?: string;
  alt?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const gallerySchema = new Schema<IGallery>(
  {
    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      trim: true,
      index: true,
    },

    alt: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Gallery: Model<IGallery> = model<IGallery>(
  "Gallery",
  gallerySchema
);

export default Gallery;