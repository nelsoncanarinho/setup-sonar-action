import * as core from '@actions/core';
import { action } from '../src/action';
import {
  mockAxiosGet,
  mockAxiosPost,
  mockGetProjectResponse,
} from './test-utils';

jest.mock('axios', () => ({
  create: () => ({
    get: mockAxiosGet,
    post: mockAxiosPost,
  }),
}));

jest.mock('@actions/github', () => ({
  context: {
    repo: {
      repo: 'project-key-1',
      owner: 'my-org-1',
    },
  },
}));

afterEach(() => {
  jest.clearAllMocks();
});

test('Fails if inputs are wrong or missing', async () => {
  const spyGetInput = jest
    .spyOn(core, 'getInput')
    .mockImplementationOnce(() => {
      throw new Error();
    });

  const exitCode = await action.run();

  expect(spyGetInput).toHaveBeenCalled();
  expect(exitCode).toBe(core.ExitCode.Failure);
});

test('Continue if project already exists', async () => {
  const fakeToken = '12db3163c7112419a5cf8bbf0b2eg7a922';

  jest.spyOn(core, 'getInput').mockReturnValueOnce(fakeToken);

  mockAxiosGet.mockResolvedValueOnce({
    config: { method: 'GET', url: '' },
    data: mockGetProjectResponse,
  });

  const exitCode = await action.run();

  expect(mockAxiosGet).toHaveBeenCalled();
  expect(exitCode).toBe(core.ExitCode.Success);
});

test('Create project', async () => {
  const fakeToken = '12db3163c7112419a5cf8bbf0b2eg7a922';

  jest.spyOn(core, 'getInput').mockReturnValueOnce(fakeToken);

  mockAxiosGet.mockResolvedValueOnce({
    config: { method: 'GET', url: '' },
    data: { components: [] },
  });
  mockAxiosPost.mockResolvedValueOnce({
    status: '200',
    config: { method: 'POST', url: '', data: '' },
  });

  const exitCode = await action.run();

  expect(mockAxiosGet).toHaveBeenCalled();
  expect(mockAxiosPost).toHaveBeenCalled();
  expect(exitCode).toBe(core.ExitCode.Success);
});
