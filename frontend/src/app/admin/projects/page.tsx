"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminProjectApi, Project } from "@/lib/api";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await adminProjectApi.getProjects();

      if (!result.success) {
        throw new Error(
          result.message || "Failed to load projects"
        );
      }

      setProjects(result.data?.items ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load projects"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadProjects();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadProjects]);

  async function togglePublish(project: Project) {
    try {
      setActionId(project._id);
      setError("");

      if (project.published) {
        await adminProjectApi.unpublishProject(project._id);
      } else {
        await adminProjectApi.publishProject(project._id);
      }

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change project status"
      );
    } finally {
      setActionId("");
    }
  }

  async function deleteProject(project: Project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(project._id);
      setError("");

      await adminProjectApi.deleteProject(project._id);
      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete project"
      );
    } finally {
      setActionId("");
    }
  }

  if (loading) {
    return (
      <p className="text-gray-500">
        Loading projects...
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Projects
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage completed and ongoing projects.
          </p>
        </div>

        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          + New Project
        </Link>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            No projects found
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Create your first project to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4">
                    Project
                  </th>

                  <th className="px-5 py-4">
                    Category
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Featured
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-gray-900">
                        {project.title}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {project.slug}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {project.category || "—"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          project.published
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {project.published
                          ? "Published"
                          : "Unpublished"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {project.featured
                        ? "Yes"
                        : "No"}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/projects/${project._id}/edit`}
                          className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium hover:bg-gray-50"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          disabled={
                            actionId === project._id
                          }
                          onClick={() =>
                            void togglePublish(project)
                          }
                          className="rounded-md border border-gray-300 px-3 py-2 text-xs font-medium disabled:opacity-50"
                        >
                          {actionId === project._id
                            ? "Please wait..."
                            : project.published
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          type="button"
                          disabled={
                            actionId === project._id
                          }
                          onClick={() =>
                            void deleteProject(project)
                          }
                          className="rounded-md border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}