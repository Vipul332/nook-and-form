import { Document, Model, Schema, model } from "mongoose";

export interface IProjectImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  description: string;
  location?: string;
  category?: string;
  style?: string;
  images: IProjectImage[];
  beforeImage?: IProjectImage;
  afterImage?: IProjectImage;
  materials: string[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IProjectImage>(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    alt: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const projectSchema = new Schema<IProject>(
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
      trim: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      trim: true,
    },

    style: {
      type: String,
      trim: true,
    },

    images: {
      type: [imageSchema],
      default: [],
    },

    beforeImage: {
      type: imageSchema,
    },

    afterImage: {
      type: imageSchema,
    },

    materials: {
      type: [String],
      default: [],
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

const Project: Model<IProject> = model<IProject>(
  "Project",
  projectSchema
);

export default Project;