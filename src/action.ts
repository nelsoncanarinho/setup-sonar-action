import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  buildCreateProjectParams,
  checkIfProjectExists,
  getInputs,
} from './action-utils';
import ApiClient from './api/api-client';

async function run() {
  try {
    const inputs = getInputs(core);

    const api = new ApiClient(inputs.sonarToken);
    const createProjectParams = buildCreateProjectParams(github);

    const projectExists = await checkIfProjectExists(api, {
      organization: createProjectParams.organization,
      projects: [createProjectParams.project],
    });

    if (projectExists) {
      return core.ExitCode.Success;
    }

    await api.createProject(createProjectParams);
    return core.ExitCode.Success;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : `Unknown error ${error}`;
    console.log(`Error details: ${error}`);
    core.setFailed(errorMessage);
  }
}

export const action = { run };
