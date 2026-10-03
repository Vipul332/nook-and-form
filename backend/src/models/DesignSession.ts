import { Document, Model, Schema, model, Types } from "mongoose";

export interface IUploadedImage {
  url: string;
  publicId: string;
}

export interface IRecommendation {
  designId: Types.ObjectId;
  matchScore: number;
  reasons: string[];
}

export interface IDesignSession extends Document {
  userId: Types.ObjectId;
  uploadedImage: IUploadedImage;
  roomAnalysis?: Record<string, unknown>;
  recommendations: IRecommendation[];
  selectedDesignId?: Types.ObjectId;
  consultationId?: Types.ObjectId;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const uploadedImageSchema = new Schema<IUploadedImage>(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const recommendationSchema = new Schema<IRecommendation>(
  {
    designId: {
      type: Schema.Types.ObjectId,
      ref: "Design",
      required: true,
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    reasons: {
      type: [String],
      default: [],
    },
  },
  {
    _id: false,
  }
);

const designSessionSchema = new Schema<IDesignSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    uploadedImage: {
      type: uploadedImageSchema,
      required: true,
    },

    roomAnalysis: {
      type: Schema.Types.Mixed,
    },

    recommendations: {
      type: [recommendationSchema],
      default: [],
    },

    selectedDesignId: {
      type: Schema.Types.ObjectId,
      ref: "Design",
    },

    consultationId: {
      type: Schema.Types.ObjectId,
      ref: "Consultation",
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

designSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const DesignSession: Model<IDesignSession> =
  model<IDesignSession>("DesignSession", designSessionSchema);

export default DesignSession;