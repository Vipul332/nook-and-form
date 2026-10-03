import Settings, { ISettings } from "../../models/Settings";
import { CreateSettingsInput, UpdateSettingsInput } from "../../schemas/settings.schema";

/* =========================================================
   Get Settings
========================================================= */

export const getSettings = async (): Promise<ISettings | null> => {
  return Settings.findOne().exec();
};

/* =========================================================
   Create Settings
========================================================= */

export const createSettings = async (
  data: CreateSettingsInput
): Promise<ISettings> => {
  const existingSettings = await Settings.findOne().exec();

  if (existingSettings) {
    throw new Error("Settings already exist");
  }

  const settings = await Settings.create(data);

  return settings;
};

/* =========================================================
   Update Settings
========================================================= */

export const updateSettings = async (
  data: UpdateSettingsInput
): Promise<ISettings> => {
  let settings = await Settings.findOne().exec();

  if (!settings) {
    settings = await Settings.create(data);
    return settings;
  }

  Object.assign(settings, data);

  await settings.save();

  return settings;
};