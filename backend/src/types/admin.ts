import { JwtPayload } from "jsonwebtoken";

export interface AdminJwtPayload extends JwtPayload {
  adminId: string;
  role: "ADMIN" | "SUPER_ADMIN";
  type: "admin";
}

export interface AuthenticatedAdmin {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  isActive: boolean;
}