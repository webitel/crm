import applyTransform, {
  snakeToCamel,
  merge,
  notify,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import getDefaultGetListResponse
  from '../../../../../app/api/defaults/getDefaultGetListResponse.js';

const mockData = {
  page: "1",
  next: true,
  items: [
    {
      id: "slaCond1",
      name: "Critical SLA Condition",
      priorities: [
        {
          id: "p1",
          name: "High",
        },
      ],
      reactionTime: {
        hours: 1,
        minutes: 0,
      },
      resolutionTime: {
        hours: 48,
        minutes: 0,
      },
      slaId: "sla1",
      createdAt: "2024-11-01T10:00:00Z",
      updatedAt: "2024-11-02T10:00:00Z",
      createdBy: {
        id: "user1",
        name: "SLA Manager",
      },
      updatedBy: {
        id: "user2",
        name: "SLA Admin",
      },
    },
    {
      id: "slaCond2",
      name: "Standard SLA Condition",
      priorities: [
        {
          id: "priority2",
          name: "Medium",
        },
      ],
      reactionTime: {
        hours: 2,
        minutes: 30,
      },
      resolutionTime: {
        hours: 72,
        minutes: 0,
      },
      slaId: "sla2",
      createdAt: "2024-11-05T11:00:00Z",
      updatedAt: "2024-11-06T11:00:00Z",
      createdBy: {
        id: "user3",
        name: "SLA Coordinator",
      },
      updatedBy: {
        id: "user4",
        name: "SLA Specialist",
      },
    },
  ],
};

const getList = async ({ slaId, priorityId, params }) => {
  try {
    const filteredItems = mockData.items.filter(item =>
      item.slaId === slaId &&
      (!priorityId || item.priorities.some(priority => priority.id === priorityId))
    );
    const { items, next } = applyTransform({ items: filteredItems }, [
      snakeToCamel(),
      merge(getDefaultGetListResponse()),
    ]);
    return new Promise((resolve) => {
      resolve({
        items,
        next,
      });
    });
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const slaConditionsAPI = {
  getList,
};

export default slaConditionsAPI;
