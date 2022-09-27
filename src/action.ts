import * as core from '@actions/core';
import * as github from '@actions/github';
import ApiClient from './api/api-client';
import { CreateProjectParams } from './api/types';

enum ActionInputKeys {
  sonarToken = 'sonarToken',
}

function getInputs() {
  const sonarToken = core.getInput(ActionInputKeys.sonarToken, {
    required: true,
  });

  console.log('Sonar token is present', Boolean(sonarToken));
  console.log('Envs', JSON.stringify(process.env));

  core.setSecret(sonarToken);

  if (!sonarToken) {
    throw new Error('sonarToken was not provided.');
  }

  return { sonarToken };
}

function buildProjectParams(): CreateProjectParams {
  const { repo } = github.context;
  const projectName = `${repo.owner}-${repo.repo}`;

  return { name: repo.repo, organization: repo.owner, project: projectName };
}

async function run() {
  try {
    const inputs = getInputs();

    const api = new ApiClient(inputs.sonarToken);
    const projectParams = buildProjectParams();

    core.debug(`Create project params: ${JSON.stringify(projectParams)}`);

    const getProjectResponse = await api.getProjectByProjectKey({
      organization: projectParams.organization,
      projects: [projectParams.project],
    });

    core.debug(`Create project params: ${JSON.stringify(getProjectResponse)}`);

    const projectExists = getProjectResponse.components.find(
      item => item.key === projectParams.project
    );

    core.debug(`Project exists: ${JSON.stringify(projectExists)}`);

    if (projectExists) {
      console.log(
        `Project ${projectExists.key} already exists. Creation will be skipped.`
      );
      return core.ExitCode.Success;
    }

    const project = await api.createProject(projectParams);

    core.debug(`Project created: ${JSON.stringify(project)}`);

    console.log(`Project created successfully!`);
    return core.ExitCode.Success;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : `Unknown error ${error}`;
    console.log(`Error details: ${error}`);
    core.setFailed(errorMessage);
  }
}

const action = { run };

export { action };
