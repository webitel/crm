import applyTransform, {
  camelToSnake,
  merge,
  notify,
  sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import getDefaultGetListResponse
  from '../../../../../app/api/defaults/getDefaultGetListResponse.js';

// Sample data for catalogs API (now includes the catalog object)
const catalogsData = {
  page: "1",
  next: true,
  items: [
    {
      id: "cat1",
      name: "Catalog 1",
      description: "This is Catalog 1.",
      prefix: "CAT1",
      code: "C1",
      state: true,
      sla: {
        id: "sla1",
        name: "Critical SLA"
      },
      status: {
        id: "s1",
        name: "Active"
      },
      closeReason: {
        id: "cr1",
        name: "Resolved"
      },
      teams: [
        {
          id: "team1",
          name: "Support Team"
        }
      ],
      skills: [
        {
          id: "skill1",
          name: "Network Troubleshooting"
        }
      ],
      createdAt: "2024-11-01T10:00:00Z",
      updatedAt: "2024-11-02T10:00:00Z",
      createdBy: {
        id: "u1",
        name: "User One"
      },
      updatedBy: {
        id: "u2",
        name: "User Two"
      },
      service: [
        {
          id: "srv1",
          name: "Network Support",
          rootId: "root1",
          description: "Service for network support.",
          code: "NS",
          state: true,
          sla: {
            id: "sla1",
            name: "Critical SLA"
          },
          group: {
            id: "group1",
            name: "Support"
          },
          assignee: {
            id: "u3",
            name: "User Three"
          },
          createdAt: "2024-11-01T10:00:00Z",
          updatedAt: "2024-11-02T10:00:00Z",
          createdBy: {
            id: "u1",
            name: "User One"
          },
          updatedBy: {
            id: "u2",
            name: "User Two"
          },
          catalogId: "cat1",
          service: []
        }
      ]
    },
    {
      id: 'catalog1',
      name: 'Main Catalog',
      description: 'This is the main service catalog.',
      prefix: 'CAT',
      code: 'CAT001',
      state: true,
      sla: {
        id: 'sla1',
        name: 'Standard SLA',
      },
      status: {
        id: 's1',
        name: 'Active',
      },
      closeReason: {
        id: 'close1',
        name: 'Resolved',
      },
      teams: [
        {
          id: 'team1',
          name: 'Support Team',
        },
      ],
      skills: [
        {
          id: 'skill1',
          name: 'Troubleshooting',
        },
      ],
      createdAt: '2024-11-01T10:00:00Z',
      updatedAt: '2024-11-05T12:00:00Z',
      createdBy: {
        id: 'user1',
        name: 'Admin User',
      },
      updatedBy: {
        id: 'user2',
        name: 'Manager User',
      },
      service: [
        {
          id: 'service1',
          name: 'Network Support',
          rootId: 'root1',
          description: 'Handles network-related issues.',
          code: 'NET001',
          state: true,
          sla: {
            id: 'sla1',
            name: 'Standard SLA',
          },
          group: {
            id: 'group1',
            name: 'IT Group',
          },
          assignee: {
            id: 'user3',
            name: 'John Doe',
          },
          createdAt: '2024-11-01T10:30:00Z',
          updatedAt: '2024-11-05T11:00:00Z',
          createdBy: {
            id: 'user1',
            name: 'Admin User',
          },
          updatedBy: {
            id: 'user2',
            name: 'Manager User',
          },
          catalogId: 'catalog1',
          service: [
            {
              id: 'subservice1',
              name: 'Wi-Fi Support',
              rootId: 'root2',
              description: 'Assistance with Wi-Fi connectivity issues.',
              code: 'WF001',
              state: true,
              sla: {
                id: 'sla2',
                name: 'Priority SLA',
              },
              group: {
                id: 'group2',
                name: 'Network Team',
              },
              assignee: {
                id: 'user4',
                name: 'Jane Smith',
              },
              createdAt: '2024-11-02T09:00:00Z',
              updatedAt: '2024-11-04T15:00:00Z',
              createdBy: {
                id: 'user1',
                name: 'Admin User',
              },
              updatedBy: {
                id: 'user2',
                name: 'Manager User',
              },
              catalogId: 'catalog1',
              service: [
                {
                  id: 'subservice2',
                  name: 'Router Configuration',
                  rootId: 'root3',
                  description: 'Guidance on router setup and troubleshooting.',
                  code: 'RT001',
                  state: true,
                  sla: {
                    id: 'sla3',
                    name: 'Critical SLA',
                  },
                  group: {
                    id: 'group3',
                    name: 'Infrastructure Team',
                  },
                  assignee: {
                    id: 'user5',
                    name: 'Mark Lee',
                  },
                  createdAt: '2024-11-03T12:00:00Z',
                  updatedAt: '2024-11-05T14:00:00Z',
                  createdBy: {
                    id: 'user1',
                    name: 'Admin User',
                  },
                  updatedBy: {
                    id: 'user2',
                    name: 'Manager User',
                  },
                  catalogId: 'catalog1',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Get method for the Catalogs API
const getList = async (params) => {
  try {
    const { items, next } = applyTransform(catalogsData, [
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

const get = async ({ itemId: id }) => {
  try {
    const bucketData = catalogsData.items.find((item) => item.id === id);

    if (!bucketData) {
      throw new Error("Item not found");
    }

    const transformedData = applyTransform(bucketData, [snakeToCamel()]);

    return new Promise((resolve) => {
      resolve(transformedData);
    });
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};


const catalogsAPI = {
  getList,
  get,
};

export default catalogsAPI;
