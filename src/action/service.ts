import { Core, Github } from '../lib/lib';
import ApiClient from '../api/api-client';
import {
  CreateProjectParams,
  GetProjectsByProjectKeyParams,
} from '../api/types';
import { AxiosError } from 'axios';

export enum ActionInputKeys {
  sonarToken = 'SONAR_TOKEN',
  project = 'project',
  organization = 'organization',
  projectName = 'projectName',
}

interface ActionInputs {
  sonarToken: string;
  project: string;
  organization: string;
  projectName: string;
}

export function getInputs(core: Core): ActionInputs {
  const sonarToken = core.getInput(ActionInputKeys.sonarToken, {
    required: true,
  });

  const project = core.getInput(ActionInputKeys.project);
  const organization = core.getInput(ActionInputKeys.organization);
  const projectName = core.getInput(ActionInputKeys.projectName);

  return { sonarToken, project, organization, projectName };
}

export function buildCreateProjectParams(
  github: Github,
  inputs: ActionInputs
): CreateProjectParams {
  const { repo } = github.context;
  const project = inputs.project || repo.repo;
  const name = inputs.projectName || repo.repo;
  const organization = inputs.organization || repo.owner;

  return { name, organization, project };
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
  return error instanceof Error || error instanceof AxiosError
    ? error.message
    : `Unknown error ${JSON.stringify(error)}`;
}
