const filterTransformersMap = {
  'createdAtFrom': (value) => `created_at.from=${value}`,
  'createdAtTo': (value) => `created_at.to=${value}`,
  'statusCase': (value) => `status_condition=${value.conditions}`,
  'sourceCase': (value) => `source=${value}`,
  'author': (value) => `created_by=${value}`,
  'reporter': (value) => `reporter=${value}`,
  'impacted': (value) => `impacted=${value}`,
  'assignee': (value) => value.unassigned ? `assignee=${value.list},${null}` : `assignee=${value.list}`,
  'contactGroup': (value) => value.unassigned ? `group=${value.list},${null}` : `group=${value.list}`,
  'priorityCase': (value) => `priority=${value}`,
  'closeReasonGroupsCase': (value) => `close_reason=${value.conditions}`,
  'rating': (value) => {
    const arr = [];
    if(value.from) arr.push(`rating.from=${value.from}`);
    if(value.to) arr.push(`rating.to=${value.to}`);
    return arr;
  },
  'service': (value) => `service=${value}`,
  'sla': (value) => `sla=${value}`,
  'slaCondition': (value) => `sla_condition=${value.conditions}`,
  'reactionTime': (value) => {
    const arr = [];
    if(value.from) arr.push(`planned_reaction_at.from=${value.from}`);
    if(value.to) arr.push(`planned_reaction_at.to=${value.to}`);
    return arr;
  },
  'resolutionTime': (value) => {
    const arr = [];
    if(value.from) arr.push(`planned_resolved_at.from=${value.from}`);
    if(value.to) arr.push(`planned_resolved_at.to=${value.to}`);
    return arr;
  },
  'actualReactionTime': (value) => {
    const arr = [];
    if(value.from) arr.push(`reacted_at.from=${value.from}`);
    if(value.to) arr.push(`reacted_at.to=${value.to}`);
    return arr;
  },
  'actualResolutionTime': (value) => {
    const arr = [];
    if(value.from) arr.push(`resolved_at.from=${value.from}`);
    if(value.to) arr.push(`resolved_at.to=${value.to}`);
    return arr;
  },
  'hasAttachment': (value) => `attachments=${value}`,
};

export const stringifyCaseFilters = (params) => {
  const result = [];

  for (const param in params) {
    const value = params[param];

    const transformer = filterTransformersMap[param];
    if (transformer) {
      const transformedValue = transformer(value);
      if (transformedValue) {
        result.push(transformedValue);
      }
    }
  }
  return result;
};
