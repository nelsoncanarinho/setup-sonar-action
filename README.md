# renewed typescript action

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![ci](https://github.com/nelsoncanarinho/renewed-typescript-action/actions/workflows/main.yml/badge.svg)](https://github.com/nelsoncanarinho/renewed-typescript-action/actions/workflows/main.yml)
[![semantic-release: angular](https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release)](https://github.com/semantic-release/semantic-release)

## Create awesome Github Actions with Typescript 😎

This is a ready to use Typescript template for create Github Actions.

This template includes compilation support, tests, a validation workflow, publishing, and versioning.

It's based on [actions/typescript-action](https://github.com/actions/typescript-action) with some tweaks.

### Tweaks

- Uses `pnpm` as package manager;
- Uses `eslint` and `prettier` with minimal configuration;
- Up to date dependencies;
- Simpler build configuration;
- Easy to customize composable workflow;
- Automatic release workflow;

## Create an action from this template

Click the `Use this Template` and provide the new repo details for your action.

Make sure you have `nodejs` and `pnpm` installed on your machine.

## Code in Main

Install the dependencies

```bash
pnpm install
```

Build the typescript and package it for distribution

```bash
pnpm build
```

Run the tests ✅:

```bash
$ pnpm test

 PASS  ./wait.test.js
  ✓ throws invalid number (3ms)
  ✓ wait 500 ms (504ms)
  ✓ test runs (95ms)
```

## Change action.yml

The action.yml defines the inputs and output for your action.

Update the action.yml with your name, description, inputs and outputs for your action.

See the [documentation](https://help.github.com/en/articles/metadata-syntax-for-github-actions)

## Change the Code

Most toolkit and CI/CD operations involve async operations so the action is run in an async function.

```javascript
import * as core from '@actions/core';
...

async function run() {
  try {
      ...
  }
  catch (error) {
    core.setFailed(error.message);
  }
}
```

See the [toolkit documentation](https://github.com/actions/toolkit/blob/master/README.md#packages) for the various packages.

## Publish to a distribution branch

Push code to `main` triggers a continuous integration pipeline that will take care of validate the source code, generate build artifacts and a new release based on the commits.

> It's recommended to follow [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) guidelines to have a meaningfully commit history and to take advantage of [semantic-release](https://github.com/semantic-release/semantic-release/blob/master/README.md#how-does-it-work) automatic versioning.
