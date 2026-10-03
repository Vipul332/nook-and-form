import { Document, Model, Schema, model } from "mongoose";

export interface IDesignImage {
  url: string;
  publicId: string;
  alt?: string;
}

export interface IDesign extends Document {
  title: string;
  slug: string;
  description: string;
  roomType: string;
  style: string;
  colors: string[];
  materials: string[];
  budgetMin?: number;
  budgetMax?: number;
  tags: string[];
  images: IDesignImage[];
  aiEnabled: boolean;
  featured: boolean;
  published: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const designImageSchema = new Schema<IDesignImage>(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
      maxlength: 250,
    },
  },
  { _id: false }
);

const designSchema = new Schema<IDesign>(
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

    roomType: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    style: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    colors: {
      type: [String],
      default: [],
      index: true,
    },

    materials: {
      type: [String],
      default: [],
      index: true,
    },

    budgetMin: {
      type: Number,
      min: 0,
    },

    budgetMax: {
      type: Number,
      min: 0,
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    images: {
      type: [designImageSchema],
      default: [],
    },

    aiEnabled: {
      type: Boolean,
      default: true,
      index: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    published: {
      type: Boolean,
      default: false,
      index: true,
    },

    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },

  {
    timestamps: true,
    versionKey: false,
  }
);

designSchema.index({
  title: "text",
  description: "text",
  tags: "text",
});

designSchema.index({
  published: 1,
  isArchived: 1,
  featured: 1,
  createdAt: -1,
});

designSchema.index({
  roomType: 1,
  style: 1,
  isArchived: 1,
});

const Design: Model<IDesign> = model<IDesign>(
  "Design",
  designSchema
);

export default Design;