import mongoose, { Document, Schema } from "mongoose";

export interface IAdmin extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["ADMIN", "SUPER_ADMIN"],
      default: "ADMIN",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;