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
  },
  {
    field: 'rating',
    param: 'rating',
  },
  {
    field: 'assignee',
    param: 'assignee',
  },
  {
    field: 'attachments',
    param: 'hasAttachment',
  },
  {
    field: 'status_condition',
    param: 'statusCase',
  },
  {
    field: 'close_reason_group',
    param: 'closeReasonGroupsCase',
  },
  {
    field: 'reaction_time',
    param: 'reactionTime',
  },
  {
    field: 'resolution_time',
    param: 'resolutionTime',
  },
  {
    field: 'actual_reaction_time',
    param: 'actualReactionTime',
  },
  {
    field: 'actual_resolution_time',
    param: 'actualResolutionTime',
  },
];

export const caseFilters = (params) => {
  const result = []

  filters.forEach(item => {

    if (params[item.param]) {
      const value = params[item.param];

      if(value.from && value.to) {
        result.push(`${item.field}.from=${value.from}`);
        result.push(`${item.field}.to=${value.to}`);
      } else if(params.statusCase || params.closeReasonGroupsCase) {
        result.push(`${item.field}=${value.conditions}`);
      } else if(params.assignee) {
        if(value.unassigned) {
          result.push(`${item.field}=${value.list},${null}`);
        } else
          result.push(`${item.field}=${value.list}`);
      } else {
        result.push(`${item.field}=${value}`);
      }
    }
  });
  return result;
}






