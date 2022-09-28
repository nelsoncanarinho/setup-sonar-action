import { Core, Github } from '../lib';
import ApiClient from '../api/api-client';
import {
  CreateProjectParams,
  GetProjectsByProjectKeyParams,
} from '../api/types';

export enum ActionInputKeys {
  sonarToken = 'SONAR_TOKEN',
}

export function getInputs(core: Core) {
  const sonarToken = core.getInput(ActionInputKeys.sonarToken, {
    required: true,
  });

  return { sonarToken };
}

export function buildCreateProjectParams(github: Github): CreateProjectParams {
  const { repo } = github.context;
  const projectName = `${repo.owner}-${repo.repo}`;

  return { name: repo.repo, organization: repo.owner, project: projectName };
}

export async function checkIfProjectExists(
  api: ApiClient,
  params: GetProjectsByProjectKeyParams
) {
  const getProjectResponse = await api.getProjectByProjectKey(params);

  const projectExists = getProjectResponse.components.find(
    item => item.key === params.projects[0]
  );

  return projectExists;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : `Unknown error ${JSON.stringify(error)}`;
}
