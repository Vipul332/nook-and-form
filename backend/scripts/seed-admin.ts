import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import Admin from "../src/models/Admin";

const run = async (): Promise<void> => {
  const {
    MONGODB_URI,
    ADMIN_NAME,
    ADMIN_EMAIL,
    ADMIN_PASSWORD,
  } = process.env;

  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not configured"
    );
  }

  if (
    !ADMIN_NAME ||
    !ADMIN_EMAIL ||
    !ADMIN_PASSWORD
  ) {
    throw new Error(
      "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
    );
  }

  if (ADMIN_PASSWORD.length < 8) {
    throw new Error(
      "ADMIN_PASSWORD must be at least 8 characters"
    );
  }

  await mongoose.connect(MONGODB_URI);

  const email = ADMIN_EMAIL
    .toLowerCase()
    .trim();

  const existingAdmin = await Admin.findOne({
    email,
  });

  if (existingAdmin) {
    console.log(
      `Admin already exists: ${email}`
    );

    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(
    ADMIN_PASSWORD,
    12
  );

  await Admin.create({
    name: ADMIN_NAME.trim(),
    email,
    passwordHash,
    role: "ADMIN",
    isActive: true,
  });

  console.log(
    `Admin created successfully: ${email}`
  );

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(
    "Admin seed failed:",
    error
  );

  await mongoose.disconnect();

  process.exit(1);
});