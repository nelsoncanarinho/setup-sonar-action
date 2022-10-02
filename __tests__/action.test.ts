import * as core from '@actions/core';
import { action } from '../src/action';

const mockGetProject = {
  paging: {
    pageIndex: 1,
    pageSize: 100,
    total: 2,
  },
  components: [
    {
      organization: 'my-org-1',
      key: 'project-key-1',
      name: 'Project Name 1',
      qualifier: 'TRK',
      visibility: 'public',
      lastAnalysisDate: '2017-03-01T11:39:03+0300',
      revision: 'cfb82f55c6ef32e61828c4cb3db2da12795fd767',
    },
    {
      organization: 'my-org-1',
      key: 'project-key-2',
      name: 'Project Name 1',
      qualifier: 'TRK',
      visibility: 'private',
      lastAnalysisDate: '2017-03-02T15:21:47+0300',
      revision: '7be96a94ac0c95a61ee6ee0ef9c6f808d386a355',
    },
  ],
};

const mockAxiosGet = jest.fn();
const mockAxiosPost = jest.fn();

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
    data: mockGetProject,
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
