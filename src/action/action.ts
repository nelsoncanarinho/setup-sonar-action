import * as core from '@actions/core';
import ApiClient from '../api/api-client';
import { ActionOutputKeys } from './types';
import { buildCreateProjectParams, getInputs } from './utils';

export async function run() {
  try {
    const inputs = getInputs();

    const api = new ApiClient(inputs.sonarToken);
    const createProjectParams = buildCreateProjectParams(inputs);

    const getProjectResponse = await api.getProjectByProjectKey({
      organization: createProjectParams.organization,
      projects: [createProjectParams.project],
    });

    const projectExists = getProjectResponse.components.find(
      item => item.key === createProjectParams.project
    );

    if (projectExists) {
      core.setOutput(ActionOutputKeys.organization, projectExists.organization);
      core.setOutput(ActionOutputKeys.projectKey, projectExists.key);

      return core.ExitCode.Success;
    }

    const { project } = await api.createProject(createProjectParams);

    const shouldRenameMainBranch = inputs.mainBranch !== 'master';

    if (shouldRenameMainBranch) {
      await api.renameMasterBranch({
        name: inputs.mainBranch,
        project: project.key,
      });
    }

    core.setOutput(ActionOutputKeys.organization, inputs.organization);
    core.setOutput(ActionOutputKeys.projectKey, project.key);

    return core.ExitCode.Success;
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed(`Failed to complete action.`);
    }

    core.debug(JSON.stringify(error));
    return core.ExitCode.Failure;
  }
}
