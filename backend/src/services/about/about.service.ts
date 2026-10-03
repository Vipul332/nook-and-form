import About, { IAbout } from "../../models/About";
import {
  CreateAboutInput,
  UpdateAboutInput,
} from "../../schemas/about.schema";

/* =========================================================
   Get About
========================================================= */

export const getAbout = async (): Promise<IAbout | null> => {
  return About.findOne().exec();
};

/* =========================================================
   Get Published About
========================================================= */

export const getPublishedAbout =
  async (): Promise<IAbout | null> => {
    return About.findOne({
      published: true,
    }).exec();
  };

/* =========================================================
   Create About
========================================================= */

export const createAbout = async (
  data: CreateAboutInput
): Promise<IAbout> => {
  const existingAbout = await About.findOne().exec();

  if (existingAbout) {
    throw new Error("About content already exists");
  }

  const about = await About.create(data);

  return about;
};

/* =========================================================
   Update About
========================================================= */

export const updateAbout = async (
  data: UpdateAboutInput
): Promise<IAbout> => {
  let about = await About.findOne().exec();

  if (!about) {
    about = await About.create(data);

    return about;
  }

  Object.assign(about, data);

  await about.save();

  return about;
};

/* =========================================================
   Publish About
========================================================= */

export const publishAbout = async (): Promise<IAbout> => {
  let about = await About.findOne().exec();

  if (!about) {
    throw new Error(
      "About content does not exist"
    );
  }

  about.published = true;

  await about.save();

  return about;
};

/* =========================================================
   Unpublish About
========================================================= */

export const unpublishAbout =
  async (): Promise<IAbout> => {
    let about = await About.findOne().exec();

    if (!about) {
      throw new Error(
        "About content does not exist"
      );
    }

    about.published = false;

    await about.save();

    return about;
  };