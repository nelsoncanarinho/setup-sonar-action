import * as core from '@actions/core';
import * as github from '@actions/github';
import ApiClient from '../api/api-client';
import {
  buildCreateProjectParams,
  checkIfProjectExists,
  getErrorMessage,
  getInputs,
} from './service';

export async function run() {
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
    console.error(`Error details: ${error}`);
    core.setFailed(getErrorMessage(error));
  }
}
