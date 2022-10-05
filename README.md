# set-up-sonar

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ci](https://github.com/nelsoncanarinho/renewed-typescript-action/actions/workflows/main.yml/badge.svg)](https://github.com/nelsoncanarinho/renewed-typescript-action/actions/workflows/main.yml)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=create-sonar-project&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=create-sonar-project)

## Setup a new project in SonarCloud from CI

Thanks to the SonarCloud team, it's already easy to integrate it into your GitHub workflow using the official action, but some manual work is still required before you have your first analysis done.

This action offers an intuitive way to prepare your project to be analyzed for the first time directly from your CI pipeline. It may help you to build templates or reusable workflows integrated with SonarCloud without leaving GitHub.

## Requirements

Have an account in SonarCloud;
A SonarCloud Api token;

## Usage

First, create a secret with your SonarCloud Api Token following [this guide](Encrypted secrets - GitHub Docs), and then add this action to your workflow like below:

```yml
- name: Setup SonarCloud
  uses: nelsoncanarinho/setup-sonar@v1
  with:
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

This will create a new project in your SonarCloud organization using your repo name as the project key. It'll also rename Sonar's default branch to match the GitHub default (main).

The action will always output a `SONAR_ORGANIZATION` and `SONAR_PROJECT_KEY`, but it creates the project only once, as expected.

A standard workflow would look like this:

```yml
on:
  push:
    branches:
      - main
jobs:
  sonarcloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Sonar
        id: setupSonar
        uses: ./
        with:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      - name: SonarCloud Scan
        uses: sonarsource/sonarcloud-github-action@master
        with:
          args: >
            -Dsonar.organization=${{steps.setupSonar.outputs.SONAR_ORGANIZATION}}
            -Dsonar.projectKey=${{steps.setupSonar.outputs.SONAR_PROJECT_KEY}}
            -Dsonar.qualitygate.wait=true ## Failed analysis will fail the action
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```
