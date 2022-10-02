export const mockGetProjectResponse = {
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

export const mockAxiosGet = jest.fn();
export const mockAxiosPost = jest.fn();
