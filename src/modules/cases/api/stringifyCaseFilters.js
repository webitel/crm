import {
  isRelativeDatetimeValue,
  normalizeToTimestamp,
} from '@webitel/ui-sdk/scripts';
import { startOfToday } from 'date-fns';
import isObject from 'lodash/isObject';

const filterTransformersMap = {
  createdAt: (createdAt) => {
    const arr = [];
    if (!createdAt) {
      arr.push(
        `created_at.from=${normalizeToTimestamp(startOfToday().getTime())}`,
      );
    } else {
      if (typeof createdAt === 'string') {
        arr.push(
          `created_at.from=${normalizeToTimestamp(createdAt, { round: 'start' })}`,
          `created_at.to=${normalizeToTimestamp(createdAt, { round: 'end' })}`,
        );
      } else {
        if (createdAt.from) arr.push(`created_at.from=${createdAt.from}`);
        if (createdAt.to) arr.push(`created_at.to=${createdAt.to}`);
      }
    }
    return arr;
  },
  status: (value) => `status_condition=${value.conditions}`,
  source: (value) => `source=${value}`,
  author: (value) => `created_by=${value}`,
  reporter: (value) => `reporter=${value}`,
  impacted: (value) => `impacted=${value}`,
  assignee: (value) =>
    value.unassigned
      ? `assignee=${value.list},${null}`
      : `assignee=${value.list}`,
  contactGroup: (value) =>
    value.unassigned ? `group=${value.list},${null}` : `group=${value.list}`,
  priority: (value) => `priority=${value}`,
  closeReasonGroups: (value) => `close_reason=${value.conditions}`,
  rating: (value) => {
    const arr = [];
    if (value.from) arr.push(`rating.from=${value.from}`);
    if (value.to) arr.push(`rating.to=${value.to}`);
    return arr;
  },
  service: (value) => `service=${value}`,
  sla: (value) => `sla=${value}`,
  slaCondition: (value) => `sla_condition=${value.conditions}`,
  reactionTime: (value) => {
    const arr = [];
    if (value.from) arr.push(`planned_reaction_at.from=${value.from}`);
    if (value.to) arr.push(`planned_reaction_at.to=${value.to}`);
    return arr;
  },
  resolutionTime: (value) => {
    const arr = [];
    if (value.from) arr.push(`planned_resolve_at.from=${value.from}`);
    if (value.to) arr.push(`planned_resolve_at.to=${value.to}`);
    return arr;
  },
  actualReactionTime: (value) => {
    const arr = [];
    if (value.from) arr.push(`reacted_at.from=${value.from}`);
    if (value.to) arr.push(`reacted_at.to=${value.to}`);
    return arr;
  },
  actualResolutionTime: (value) => {
    const arr = [];
    if (value.from) arr.push(`resolved_at.from=${value.from}`);
    if (value.to) arr.push(`resolved_at.to=${value.to}`);
    return arr;
  },
  hasAttachment: (value) => `attachments=${value}`,
  others: (value, key) => {
    const makeArrWithStringValuesFromObjectValue = (value, key) => {
      return Object.entries(value).reduce((strValue, [propKey, propValue]) => {
        return [...strValue, `${key}.${propKey}=${propValue}`];
      }, []);
    };

    /* extension datetime fields timestamp is in s, not ms
     (shorter, less precise, 8 digits instead of 11)  */
    const extensionDatetimeFieldMultiplier = 1000;

    /* then value is magic datetime string */
    if (isRelativeDatetimeValue(value)) {
      const normalizedValue = {
        from: Math.floor(
          normalizeToTimestamp(value, { round: 'start' }) /
            extensionDatetimeFieldMultiplier,
        ),
        to: Math.ceil(
          normalizeToTimestamp(value, { round: 'end' }) /
            extensionDatetimeFieldMultiplier,
        ),
      };
      return makeArrWithStringValuesFromObjectValue(normalizedValue, key);
    }

    /**
     * @author @dlohvinov
     * if..., then assume its a datetime and it should be divided
     * by extensionDatetimeFieldMultiplier
     */
    if (value?.from || value?.to) {
      const normalizedValue = {};

      if (value.from) {
        normalizedValue.from = Math.floor(
          normalizeToTimestamp(value.from) / extensionDatetimeFieldMultiplier,
        );
      }

      if (value.to) {
        normalizedValue.to = Math.ceil(
          normalizeToTimestamp(value.to) / extensionDatetimeFieldMultiplier,
        );
      }

      return makeArrWithStringValuesFromObjectValue(normalizedValue, key);
    }

    if (!isObject(value) || Array.isArray(value)) return `${key}=${value}`;

    return makeArrWithStringValuesFromObjectValue(value, key);
  },
};

export const stringifyCaseFilters = (filters) => {
  const result = [];

  for (const [key, value] of Object.entries(filters)) {
    const transformer =
      filterTransformersMap[key] || filterTransformersMap.others;

    const strValue = transformer(value, key);

    if (value != null && strValue) {
      if (Array.isArray(strValue)) {
        result.push(...strValue);
      } else result.push(strValue);
    }
  }
  return result;
};
