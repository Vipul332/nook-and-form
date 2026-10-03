import { Document, Model, Schema, model } from "mongoose";

export interface IUser extends Document {
  phone: string;
  name?: string;
  email?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 150,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User: Model<IUser> = model<IUser>("User", userSchema);

export default User;