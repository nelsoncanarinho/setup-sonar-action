import axios, { AxiosError, AxiosInstance } from 'axios';
import {
  API_CONFIG,
  CreateProjectParams,
  CreateProjectResponse,
  GetProjectsByProjectKeyParams,
  GetProjectsByProjectKeyResponse,
  PostBranchRenameParams,
} from './types';

export default class ApiClient {
  private httpClient: AxiosInstance;

  constructor(apiToken: string) {
    this.httpClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      auth: { username: apiToken, password: '' },
    });
  }

  async createProject(params: CreateProjectParams) {
    return this.httpClient
      .post<CreateProjectResponse>(`${API_CONFIG.PATHS.PROJECTS}/create`, '', {
        params,
      })
      .then(res => res.data)
      .catch((error: AxiosError) => {
        if (error.status === '400') {
          throw new Error(
            `CREATE_PROJECT_ERROR: project ${
              params.project
            } may already exists or parameters are missing. Params: ${JSON.stringify(
              params
            )}`,
            { cause: error }
          );
        }

        if (error.status === '403') {
          throw new Error(
            `CREATE_PROJECT_ERROR: insufficient privileges to ${params.organization} or missing credentials.`,
            { cause: error }
          );
        }

        if (error.status === '404') {
          throw new Error(
            `CREATE_PROJECT_ERROR: organization ${params.organization} not found`,
            { cause: error }
          );
        }

        throw new Error(
          `CREATE_PROJECT_ERROR: fails to create project. Try again later.`,
          { cause: error }
        );
      });
  }

  async getProjectByProjectKey(params: GetProjectsByProjectKeyParams) {
    return this.httpClient
      .get<GetProjectsByProjectKeyResponse>(
        `${API_CONFIG.PATHS.PROJECTS}/search`,
        {
          params,
        }
      )
      .then(res => res.data)
      .catch((error: AxiosError) => {
        if (error.status === '400') {
          throw new Error(
            `GET_PROJECT_ERROR: parameters are missing. Check them and try again. Params: ${JSON.stringify(
              params
            )}`,
            { cause: error }
          );
        }

        if (error.status === '403') {
          throw new Error(
            `GET_PROJECT_ERROR: insufficient privileges to organization ${params.organization} or missing credentials.`,
            { cause: error }
          );
        }

        if (error.status === '404') {
          throw new Error(
            `GET_PROJECT_ERROR: organization ${params.organization} not found`,
            { cause: error }
          );
        }

        throw new Error(
          `GET_PROJECT_ERROR: fails to get projects for organization ${params.organization}. Try again later.`,
          { cause: error }
        );
      });
  }

  async renameMasterBranch(params: PostBranchRenameParams) {
    return this.httpClient
      .post(`${API_CONFIG.PATHS.BRANCHES}/rename`, '', {
        params,
      })
      .catch((error: AxiosError) => {
        if (error.status === '400') {
          throw new Error(
            `RENAME_MASTER_BRANCH_ERROR: parameters are missing. Check them and try again. Params: ${JSON.stringify(
              params
            )}`,
            { cause: error }
          );
        }

        if (error.status === '403') {
          throw new Error(
            `RENAME_MASTER_BRANCH_ERROR: insufficient privileges to ${params.project} or missing credentials.`,
            { cause: error }
          );
        }

        if (error.status === '404') {
          throw new Error(
            `RENAME_MASTER_BRANCH_ERROR: project ${params.project} not found`,
            { cause: error }
          );
        }

        throw new Error(
          `RENAME_MASTER_BRANCH_ERROR: fails to rename master branch to ${params.name}. Try again later.`,
          { cause: error }
        );
      });
  }
}
