import axios, { AxiosInstance } from 'axios';
import {
  CreateProjectParams,
  CreateProjectResponse,
  GetProjectsByProjectKeyParams,
  GetProjectsByProjectKeyResponse,
} from './types';

const API_CONFIG = {
  BASE_URL: 'https://sonarcloud.io/api',
  PATHS: {
    PROJECTS: '/projects',
  },
} as const;

export default class ApiClient {
  private httpClient: AxiosInstance;

  constructor(apiToken: string) {
    this.httpClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      auth: { username: apiToken, password: '' },
    });
  }

  async createProject(params: CreateProjectParams) {
    console.log(
      `createProject -> firing a request with: ${JSON.stringify(params)}`
    );

    return this.httpClient
      .post<CreateProjectResponse>(`${API_CONFIG.PATHS.PROJECTS}/create`, '', {
        params,
      })
      .then(res => res.data);
  }

  async getProjectByProjectKey(params: GetProjectsByProjectKeyParams) {
    console.log(
      `getProjectByProjectKey -> firing a request with: ${JSON.stringify(
        params
      )}`
    );
    return this.httpClient
      .get<GetProjectsByProjectKeyResponse>(
        `${API_CONFIG.PATHS.PROJECTS}/search`,
        {
          params,
        }
      )
      .then(res => res.data);
  }
}
