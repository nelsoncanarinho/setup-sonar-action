export interface ActionInputs {
  sonarToken: string;
  project: string;
  organization: string;
  projectName: string;
  mainBranch: string;
}

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
