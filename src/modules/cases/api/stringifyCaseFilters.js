const filterTransformersMap = {
  'createdAtFrom': (value) => `created_at.from=${value}`,
  'createdAtTo': (value) => `created_at.to=${value}`,
  'statusCase': (value) => `status=${value.conditions}`,
  'sourceCase': (value) => `source=${value}`,
  'author': (value) => `author=${value}`,
  'reporter': (value) => `reporter=${value}`,
  'impacted': (value) => `impacted=${value}`,
  'assignee': (value) => value.unassigned ? `assignee=${value.list},${null}` : `assignee=${value.list}`,
  'contactGroup': (value) => value.unassigned ? `contact_group=${value.list},${null}` : `contact_group=${value.list}`,
  'priorityCase': (value) => `priority=${value}`,
  'closeReasonGroupsCase': (value) => `close_reason_group=${value.conditions}`,
  'rating': (value) => `rating=${value}`,
  'service': (value) => `service=${value}`,
  'sla': (value) => `sla=${value}`,
  'slaCondition': (value) => `sla_condition=${value.conditions}`,
  'reactionTime': (value) => `reaction_time=${value}`,
  'resolutionTime': (value) => `resolution_time=${value}`,
  'actualReactionTime': (value) => `actual_reaction_time=${value}`,
  'actualResolutionTime': (value) => `actual_resolution_time=${value}`,
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
