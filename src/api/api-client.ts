import axios, { AxiosError, AxiosInstance } from 'axios';
import Debugger from '../lib/Logger';
import {
  API_CONFIG,
  CreateProjectParams,
  CreateProjectResponse,
  GetProjectsByProjectKeyParams,
  GetProjectsByProjectKeyResponse,
} from './types';

export default class ApiClient {
  private httpClient: AxiosInstance;
  private logger: Debugger;

  constructor(apiToken: string, logger: Debugger) {
    this.httpClient = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      auth: { username: apiToken, password: '' },
    });

    this.logger = logger;
  }

  async createProject(params: CreateProjectParams) {
    this.logger.logAxiosCall(
      'POST',
      `${API_CONFIG.BASE_URL}${API_CONFIG.PATHS.PROJECTS}/create`,
      params
    );

    return this.httpClient
      .post<CreateProjectResponse>(`${API_CONFIG.PATHS.PROJECTS}/create`, '', {
        params,
      })
      .then(res => {
        this.logger.logAxiosResponse(res);
        return res.data;
      })
      .catch((error: AxiosError) => {
        this.logger.logAxiosError(error);
        throw error;
      });
  }

  async getProjectByProjectKey(params: GetProjectsByProjectKeyParams) {
    this.logger.logAxiosCall(
      'GET',
      `${API_CONFIG.BASE_URL}${API_CONFIG.PATHS.PROJECTS}/search`,
      params
    );

    return this.httpClient
      .get<GetProjectsByProjectKeyResponse>(
        `${API_CONFIG.PATHS.PROJECTS}/search`,
        {
          params,
        }
      )
      .then(res => {
        this.logger.logAxiosResponse(res);
        return res.data;
      })
      .catch((error: AxiosError) => {
        this.logger.logAxiosError(error);
        throw error;
      });
  }
}
