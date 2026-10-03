import { IProject, IProjectImage } from "../models/Project";

export type ProjectImage = IProjectImage;

export type ProjectResponse = IProject;

export interface ProjectListResponse {
  items: IProject[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}