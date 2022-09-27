export interface CreateProjectParams {
  project: string;
  organization: string;
  name: string;
}

export interface Project {
  key: string;
  name: string;
  qualifier: string;
  visibility: 'public' | 'private';
}

export interface CreateProjectResponse {
  project: Project;
}

export interface GetProjectsByProjectKeyParams {
  organization: string;
  projects: string[];
}

export type GetProjectsByProjectKeyResponse = {
  components: Array<
    Project & {
      lastAnalysisDate: Date;
      revision: string;
    }
  >;
};
