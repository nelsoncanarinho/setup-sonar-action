import * as core from '@actions/core';
import * as github from '@actions/github';
import ApiClient from '../api/api-client';
import Logger from '../lib/Logger';
import {
  buildCreateProjectParams,
  checkIfProjectExists,
  getErrorMessage,
  getInputs,
  renameBranch,
  setOutput,
} from './service';

export async function run() {
  try {
    const inputs = getInputs(core);

    const api = new ApiClient(inputs.sonarToken, new Logger(core.debug));
    const createProjectParams = buildCreateProjectParams(github, inputs);

    const checkIfProjectExistsParams = {
      organization: createProjectParams.organization,
      projects: [createProjectParams.project],
    };

    const projectExists = await checkIfProjectExists(
      api,
      checkIfProjectExistsParams
    );

    if (projectExists) {
      setOutput(core, projectExists);
      return core.ExitCode.Success;
    }

    const { project } = await api.createProject(createProjectParams);
    await renameBranch(inputs.mainBranch, project.key, api);

    setOutput(core, {
      ...project,
      organization: createProjectParams.organization,
    });

    return core.ExitCode.Success;
  } catch (error) {
    core.setFailed(getErrorMessage(error));
    return core.ExitCode.Failure;
  }
}
