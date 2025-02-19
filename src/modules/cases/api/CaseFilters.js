const filters = [
  {
    field: 'created_at.from',
    param: 'createdAtFrom',
  },
  {
    field: 'created_at.to',
    param: 'createdAtTo',
  },
  {
    field: 'source',
    param: 'sourceCase',
  },
  {
    field: 'priority',
    param: 'priorityCase',
  },
  {
    field: 'author',
    param: 'author',
  },
  {
    field: 'reporter',
    param: 'reporter',
  },
  {
    field: 'impacted',
    param: 'impacted',
  }
];

export const caseFilters = (params) => {
  const result = [];

  filters.forEach(item => {
    if (params[item.param || item.params]) {
      const value = params[item.param || item.params];

      if (Array.isArray(value)) {
        value.forEach(val => {
          result.push(`${item.field}=${val}`);
        });
      } else {
        result.push(`${item.field}=${value}`);
      }
    }
  });

  return result;
}






