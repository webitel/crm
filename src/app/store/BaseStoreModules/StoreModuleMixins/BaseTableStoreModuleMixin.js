import deepCopy from 'deep-copy';

const state = {
  headers: [],
  dataList: [],
  aggs: {},
  size: 10,
  search: '',
  page: 1,
  sort: '',
  isNextPage: false,
};

export default {
  generateState: () => deepCopy(state),
};
