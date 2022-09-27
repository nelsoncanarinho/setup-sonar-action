import * as core from '@actions/core';
import * as github from '@actions/github';
import ApiClient from './api/api-client';
import { CreateProjectParams } from './api/types';

enum ActionInputKeys {
  sonarToken = 'SONAR_TOKEN',
}

function getInputs() {
  const sonarToken = core.getInput(ActionInputKeys.sonarToken, {
    required: true,
  });

  core.setSecret(sonarToken);

  return { sonarToken };
}

function buildProjectParams(): CreateProjectParams {
  const { repo } = github.context;
  const projectName = `${repo.owner}-${repo.repo}`;

  return { name: repo.repo, organization: repo.owner, project: projectName };
}

async function run() {
  const inputs = getInputs();

  const api = new ApiClient(inputs.sonarToken);
  const createProjectParams = buildProjectParams();

  const getProjectResponse = await api.getProjectByProjectKey({
    organization: createProjectParams.organization,
    projects: [createProjectParams.project],
  });

  const projectExists = getProjectResponse.components.find(
    item => item.key === createProjectParams.project
  );

  if (projectExists) {
    console.log(
      `Project ${projectExists.key} already exists. Creation will be skipped.`
    );
    return core.ExitCode.Success;
  }
}

const action = { run };

export { action };
