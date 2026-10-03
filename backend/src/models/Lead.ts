import { Document, Model, Schema, model } from "mongoose";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "FOLLOW_UP"
  | "CONSULTATION"
  | "CONVERTED"
  | "CLOSED";

export interface ILead extends Document {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}

const leadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    source: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "FOLLOW_UP",
        "CONSULTATION",
        "CONVERTED",
        "CLOSED",
      ],
      default: "NEW",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Lead: Model<ILead> = model<ILead>("Lead", leadSchema);

export default Lead;