import { Core, Github } from '../lib/lib';
import ApiClient from '../api/api-client';
import {
  CreateProjectParams,
  GetProjectsByProjectKeyParams,
  Project,
} from '../api/types';
import { AxiosError } from 'axios';

export enum ActionInputKeys {
  sonarToken = 'SONAR_TOKEN',
  project = 'project',
  organization = 'organization',
  projectName = 'projectName',
  mainBranch = 'mainBranch',
}

export enum ActionOutputKeys {
  organization = 'organization',
  projectKey = 'projectKey',
}

interface ActionInputs {
  sonarToken: string;
  project: string;
  organization: string;
  projectName: string;
  mainBranch: string;
}

export function getInputs(core: Core): ActionInputs {
  const sonarToken = core.getInput(ActionInputKeys.sonarToken, {
    required: true,
  });

  const project = core.getInput(ActionInputKeys.project);
  const organization = core.getInput(ActionInputKeys.organization);
  const projectName = core.getInput(ActionInputKeys.projectName);
  const mainBranch = core.getInput(ActionInputKeys.mainBranch);

  return { sonarToken, project, organization, projectName, mainBranch };
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

export function setOutput(core: Core, project: Project) {
  core.setOutput(ActionOutputKeys.organization, project.organization);

  core.setOutput(ActionOutputKeys.projectKey, project.organization);
}

export async function renameBranch(
  name: string,
  project: string,
  api: ApiClient
) {
  if (name === 'master') return;

  return api.renameMasterBranch({ name, project });
}
