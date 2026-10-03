import { Document, Model, Schema, model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  rating: number;
  message: string;
  imageUrl?: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    role: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    imageUrl: {
      type: String,
      trim: true,
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

const Testimonial: Model<ITestimonial> =
  model<ITestimonial>("Testimonial", testimonialSchema);

export default Testimonial;