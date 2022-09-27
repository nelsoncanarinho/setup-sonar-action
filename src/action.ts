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
  try {
    const inputs = getInputs();

    const api = new ApiClient(inputs.sonarToken);
    const projectParams = buildProjectParams();

    const getProjectResponse = await api.getProjectByProjectKey({
      organization: projectParams.organization,
      projects: [projectParams.project],
    });

    const projectExists = getProjectResponse.components.find(
      item => item.key === projectParams.project
    );

    if (projectExists) {
      console.log(
        `Project ${projectExists.key} already exists. Creation will be skipped.`
      );
      return core.ExitCode.Success;
    }

    await api.createProject(projectParams);

    console.log(`Project created successfully!`);
    return core.ExitCode.Success;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : `Unknown error ${error}`;
    core.setFailed(errorMessage);
  }
}

const action = { run };

export { action };
