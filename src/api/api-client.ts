import axios, { AxiosInstance } from 'axios';
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
      .then(res => res.data);
  }

  async getProjectByProjectKey(params: GetProjectsByProjectKeyParams) {
    return this.httpClient
      .get<GetProjectsByProjectKeyResponse>(
        `${API_CONFIG.PATHS.PROJECTS}/search`,
        {
          params,
        }
      )
      .then(res => res.data);
  }

  async renameMasterBranch(params: PostBranchRenameParams) {
    return this.httpClient.post(`${API_CONFIG.PATHS.BRANCHES}/rename`, '', {
      params,
    });
  }
}
