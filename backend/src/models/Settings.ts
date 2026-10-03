import { Document, Model, Schema, model } from "mongoose";

export interface ISettings extends Document {
  businessName: string;
  businessEmail: string;
  businessWhatsApp: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  googleMapsUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  telegramUrl?: string;
  officeLatitude?: number;
  officeLongitude?: number;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>(
  {
    businessName: {
      type: String,
      required: true,
      trim: true,
    },

    businessEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    businessWhatsApp: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    city: {
      type: String,
      trim: true,
    },

    state: {
      type: String,
      trim: true,
    },

    country: {
      type: String,
      trim: true,
      default: "India",
    },

    googleMapsUrl: {
      type: String,
      trim: true,
    },

    instagramUrl: {
      type: String,
      trim: true,
    },

    facebookUrl: {
      type: String,
      trim: true,
    },

    telegramUrl: {
      type: String,
      trim: true,
    },

    officeLatitude: {
      type: Number,
      min: -90,
      max: 90,
    },

    officeLongitude: {
      type: Number,
      min: -180,
      max: 180,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Settings: Model<ISettings> =
  model<ISettings>("Settings", settingsSchema);

export default Settings;