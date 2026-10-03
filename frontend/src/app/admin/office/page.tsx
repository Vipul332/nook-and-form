
"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { adminSettingsApi, type Settings } from "@/lib/api";

interface OfficeFormData {
  address: string;
  city: string;
  state: string;
  country: string;
  googleMapsUrl: string;
  officeLatitude: string;
  officeLongitude: string;
}

export default function AdminOfficePage() {
  const [settings, setSettings] = useState<Settings | null>(null);

  const [formData, setFormData] = useState<OfficeFormData>({
    address: "",
    city: "",
    state: "",
    country: "India",
    googleMapsUrl: "",
    officeLatitude: "",
    officeLongitude: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
   * Build a Google Maps embed URL from coordinates.
   * This does not require a Google Maps API key.
   */
  const mapEmbedUrl = useMemo(() => {
    const latitude = Number(formData.officeLatitude);
    const longitude = Number(formData.officeLongitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return "";
    }

    return `https://www.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  }, [
    formData.officeLatitude,
    formData.officeLongitude,
  ]);

  /*
   * Build a Google Maps navigation link.
   */
  const navigationUrl = useMemo(() => {
    const latitude = Number(formData.officeLatitude);
    const longitude = Number(formData.officeLongitude);

    if (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude) &&
      latitude >= -90 &&
      latitude <= 90 &&
      longitude >= -180 &&
      longitude <= 180
    ) {
      return `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    }

    if (formData.googleMapsUrl.trim()) {
      return formData.googleMapsUrl.trim();
    }

    return "";
  }, [
    formData.officeLatitude,
    formData.officeLongitude,
    formData.googleMapsUrl,
  ]);

  /* =========================================================
     Load Settings
  ========================================================= */

  useEffect(() => {
    let cancelled = false;

    const loadSettings = async () => {
      try {
        setLoading(true);
        setError("");
        setMessage("");

        const response =
          await adminSettingsApi.getSettings();

        if (cancelled) {
          return;
        }

        if (!response.success || !response.data) {
          throw new Error(
            response.message ||
              "Failed to load office settings."
          );
        }

        const data = response.data;

        setSettings(data);

        setFormData({
          address: data.address ?? "",
          city: data.city ?? "",
          state: data.state ?? "",
          country: data.country ?? "India",
          googleMapsUrl: data.googleMapsUrl ?? "",
          officeLatitude:
            data.officeLatitude !== undefined
              ? String(data.officeLatitude)
              : "",
          officeLongitude:
            data.officeLongitude !== undefined
              ? String(data.officeLongitude)
              : "",
        });
      } catch (err: unknown) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load office settings."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  /* =========================================================
     Handle Input
  ========================================================= */

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setMessage("");

    if (error) {
      setError("");
    }
  };

  /* =========================================================
     Save Settings
  ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const latitude =
        formData.officeLatitude.trim() !== ""
          ? Number(formData.officeLatitude)
          : undefined;

      const longitude =
        formData.officeLongitude.trim() !== ""
          ? Number(formData.officeLongitude)
          : undefined;

      if (
        latitude !== undefined &&
        (!Number.isFinite(latitude) ||
          latitude < -90 ||
          latitude > 90)
      ) {
        throw new Error(
          "Please enter a valid latitude between -90 and 90."
        );
      }

      if (
        longitude !== undefined &&
        (!Number.isFinite(longitude) ||
          longitude < -180 ||
          longitude > 180)
      ) {
        throw new Error(
          "Please enter a valid longitude between -180 and 180."
        );
      }

      /*
       * Only office/location fields are updated here.
       *
       * Business and social information still exists in the
       * backend but is intentionally not exposed on this page.
       */
      const payload = {
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        country:
          formData.country.trim() || "India",
        googleMapsUrl:
          formData.googleMapsUrl.trim() || undefined,
        officeLatitude: latitude,
        officeLongitude: longitude,
      };

      const response =
        await adminSettingsApi.updateSettings(payload);

      if (!response.success || !response.data) {
        throw new Error(
          response.message ||
            "Failed to update office settings."
        );
      }

      const updatedSettings = response.data;

      setSettings(updatedSettings);

      setFormData({
        address: updatedSettings.address ?? "",
        city: updatedSettings.city ?? "",
        state: updatedSettings.state ?? "",
        country: updatedSettings.country ?? "India",
        googleMapsUrl:
          updatedSettings.googleMapsUrl ?? "",
        officeLatitude:
          updatedSettings.officeLatitude !== undefined
            ? String(updatedSettings.officeLatitude)
            : "",
        officeLongitude:
          updatedSettings.officeLongitude !== undefined
            ? String(updatedSettings.officeLongitude)
            : "",
      });

      setMessage(
        "Office location updated successfully."
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update office settings."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     Loading State
  ========================================================= */

  if (loading) {
    return (
      <main className="min-h-full bg-gray-50 p-6 md:p-8">
        <div className="mx-auto max-w-6xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded bg-gray-200" />
            <div className="h-4 w-80 rounded bg-gray-200" />

            <div className="rounded-2xl border bg-white p-6">
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div className="mt-6 grid gap-5 md:grid-cols-3">
                <div className="h-12 rounded-lg bg-gray-100" />
                <div className="h-12 rounded-lg bg-gray-100" />
                <div className="h-12 rounded-lg bg-gray-100" />
              </div>
            </div>

            <div className="h-80 rounded-2xl border bg-white" />
          </div>
        </div>
      </main>
    );
  }

  /* =========================================================
     Page
  ========================================================= */

  return (
    <main className="min-h-full bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}

        <header className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                Office
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Office Location
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage your office address and map location
              shown to visitors on the website.
            </p>
          </div>

          {settings && (
            <div className="text-sm text-gray-400">
              Location settings connected
            </div>
          )}
        </header>

        {/* Messages */}

        {message && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            <span className="mt-0.5 font-bold">✓</span>
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span className="mt-0.5 font-bold">!</span>
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* =================================================
              Address Card
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-lg text-white">
                  ⌖
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Office Address
                  </h2>

                  <p className="mt-0.5 text-sm text-gray-500">
                    Enter the physical address of your office.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Street Address
                </label>

                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your office address"
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="city"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              Map Card
          ================================================= */}

          <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-lg text-white">
                  ◉
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Map Location
                  </h2>

                  <p className="mt-0.5 text-sm text-gray-500">
                    Set the exact location of your office.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="officeLatitude"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Latitude
                  </label>

                  <input
                    id="officeLatitude"
                    type="number"
                    name="officeLatitude"
                    value={formData.officeLatitude}
                    onChange={handleChange}
                    step="any"
                    min="-90"
                    max="90"
                    placeholder="e.g. 28.6139"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Valid range: -90 to 90
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="officeLongitude"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Longitude
                  </label>

                  <input
                    id="officeLongitude"
                    type="number"
                    name="officeLongitude"
                    value={formData.officeLongitude}
                    onChange={handleChange}
                    step="any"
                    min="-180"
                    max="180"
                    placeholder="e.g. 77.2090"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Valid range: -180 to 180
                  </p>
                </div>
              </div>

              {/* Google Maps URL */}

              <div className="mt-5">
                <label
                  htmlFor="googleMapsUrl"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Google Maps Link
                </label>

                <input
                  id="googleMapsUrl"
                  type="url"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
                />

                <p className="mt-2 text-xs text-gray-400">
                  Optional. The latitude and longitude are
                  used for the live map preview.
                </p>
              </div>

              {/* Map Preview */}

              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
                {mapEmbedUrl ? (
                  <div className="relative">
                    <iframe
                      title="Office location map"
                      src={mapEmbedUrl}
                      className="h-90 w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />

                    {navigationUrl && (
                      <div className="border-t border-gray-200 bg-white p-4">
                        <a
                          href={navigationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                        >
                          Open Directions in Google Maps
                          <span className="ml-2">
                            ↗
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex min-h-70 flex-col items-center justify-center px-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                      ◉
                    </div>

                    <h3 className="font-semibold text-gray-700">
                      Map Preview
                    </h3>

                    <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                      Enter a valid latitude and longitude
                      above to display the office location
                      on the map.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* =================================================
              Save Bar
          ================================================= */}

          <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Save office location
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Changes will be saved to the office settings.
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Office Location"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
