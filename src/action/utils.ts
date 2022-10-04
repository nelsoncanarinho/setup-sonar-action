import * as core from '@actions/core';
import * as github from '@actions/github';

import { CreateProjectParams } from '../api/types';
import { ActionInputKeys, ActionInputs } from './types';

export function getInputs(): ActionInputs {
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
  inputs: ActionInputs
): CreateProjectParams {
  const { repo } = github.context;
  const project = inputs.project || repo.repo;
  const name = inputs.projectName || repo.repo;
  const organization = inputs.organization || repo.owner;

  return { name, organization, project };
}
