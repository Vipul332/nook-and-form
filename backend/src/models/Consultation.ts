import { Document, Model, Schema, model, Types } from "mongoose";

export type ConsultationType =
  | "PHONE"
  | "WHATSAPP"
  | "ONLINE"
  | "OFFICE_VISIT"
  | "SITE_VISIT";

export type ConsultationStatus =
  | "NEW"
  | "CONTACTED"
  | "SCHEDULED"
  | "COMPLETED"
  | "CANCELLED";

export interface IConsultation extends Document {
  userId?: Types.ObjectId;
  leadId?: Types.ObjectId;
  selectedDesignId?: Types.ObjectId;

  name: string;
  email: string;
  phone: string;

  roomImage?: {
    url: string;
    publicId: string;
  };

  consultationType: ConsultationType;
  preferredDate?: Date;
  preferredTime?: string;
  location?: string;
  message?: string;
  status: ConsultationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const consultationSchema = new Schema<IConsultation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    leadId: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      index: true,
    },

    selectedDesignId: {
      type: Schema.Types.ObjectId,
      ref: "Design",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    roomImage: {
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
    },

    consultationType: {
      type: String,
      enum: [
        "PHONE",
        "WHATSAPP",
        "ONLINE",
        "OFFICE_VISIT",
        "SITE_VISIT",
      ],
      required: true,
    },

    preferredDate: {
      type: Date,
    },

    preferredTime: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    status: {
      type: String,
      enum: [
        "NEW",
        "CONTACTED",
        "SCHEDULED",
        "COMPLETED",
        "CANCELLED",
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

const Consultation: Model<IConsultation> =
  model<IConsultation>("Consultation", consultationSchema);

export default Consultation;
