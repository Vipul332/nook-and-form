
import { Document, Model, Schema, model } from "mongoose";

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image?: string;
  startingPrice?: number;
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    shortDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      trim: true,
    },

    startingPrice: {
      type: Number,
      min: 0,
    },

    featured: {
      type: Boolean,
      default: false,
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

const Service: Model<IService> = model<IService>(
  "Service",
  serviceSchema
);

export default Service;