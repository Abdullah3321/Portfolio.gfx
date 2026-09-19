import type { AdminContent, AdminProfile, AdminProject, AdminService } from "./admin-data";

export type ContentRepository = {
  getContent(): Promise<AdminContent>;
  updateProfile(profile: AdminProfile): Promise<AdminProfile>;
  listProjects(): Promise<AdminProject[]>;
  saveProject(project: AdminProject): Promise<AdminProject>;
  removeProject(projectId: string): Promise<void>;
  listServices(): Promise<AdminService[]>;
  saveService(service: AdminService): Promise<AdminService>;
};

export type SqlRepositoryConfig = {
  client: "postgres" | "mysql";
  connectionStringEnv: string;
};

export const sqlRepositoryPlan: SqlRepositoryConfig = {
  client: "postgres",
  connectionStringEnv: "DATABASE_URL",
};
