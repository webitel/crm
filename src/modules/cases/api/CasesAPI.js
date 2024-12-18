// NOTE: local version of API and need to be deleted after the API is created in the backend

import applyTransform, {
  camelToSnake,
  merge,
  notify, sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import getDefaultGetListResponse from '../../../app/api/defaults/getDefaultGetListResponse.js';

const data = {
  page: "1",
  next: true,
  items: [
    {
      id: "1",
      ver: 1,
      etag: "etag-123",
      createdBy: {
        id: "u1",
        name: "User One"
      },
      createdAt: "2024-11-01T10:00:00Z",
      updatedBy: {
        id: "u2",
        name: "User Two"
      },
      updatedAt: "2024-11-02T10:00:00Z",
      name: "Incident 1",
      subject: "Network Issue",
      description: "The network is experiencing downtime.",
      contactInfo: "contact1@example.com",
      plannedReactionAt: "2024-11-01T12:00:00Z",
      plannedResolveAt: "2024-11-03T12:00:00Z",
      status: {
        id: "s1",
        name: "Open"
      },
      closeReasonGroup: {
        id: "crg1",
        name: "Resolved Issues"
      },
      author: {
        id: "u1",
        name: "User One"
      },
      assignee: {
        id: "u3",
        name: "User Three"
      },
      reporter: {
        id: "u4",
        name: "User Four"
      },
      impacted: {
        id: "dep1",
        name: "IT Department"
      },
      group: {
        id: "g1",
        name: "Support"
      },
      priority: {
        id: "p1",
        name: "High"
      },
      source: {
        id: "src1",
        name: "Email"
      },
      statusCondition: {
        id: "sc1",
        name: "Active"
      },
      close: {
        closeResult: "Resolved",
        closeReason: {
          id: "cr1",
          name: "Issue Resolved"
        }
      },
      rate: {
        rating: "5",
        ratingComment: "Issue resolved promptly."
      },
      timing: {
        resolvedAt: "2024-11-03T10:00:00Z",
        reactedAt: "2024-11-01T10:30:00Z",
        differenceInReaction: "30m",
        differenceInResolve: "2d"
      },
      slaCondition: [
        {
          id: "sla1",
          name: "Critical SLA",
          priorities: [
            {
              id: "p1",
              name: "High"
            }
          ],
          reactionTime: {
            hours: 1,
            minutes: 0
          },
          resolutionTime: {
            hours: 48,
            minutes: 0
          },
          slaId: "slaId1",
          createdAt: "2024-10-01T10:00:00Z",
          updatedAt: "2024-10-01T12:00:00Z",
          createdBy: {
            id: "u5",
            name: "SLA Manager"
          },
          updatedBy: {
            id: "u6",
            name: "SLA Admin"
          }
        }
      ],
      service: {
        id: "subservice2",
        name: "Network Support"
      },
      comments: {
        page: "1",
        next: true,
        items: [
          {
            id: "c1",
            ver: 1,
            etag: "etag-456",
            createdBy: {
              id: "u3",
              name: "User Three"
            },
            createdAt: "2024-11-01T15:00:00Z",
            updatedBy: {
              id: "u4",
              name: "User Four"
            },
            updatedAt: "2024-11-01T16:00:00Z",
            author: {
              id: "u3",
              name: "User Three"
            },
            text: "The issue is under investigation.",
            edited: true
          }
        ]
      },
      related: {
        page: "1",
        next: true,
        items: [
          {
            id: "rel1",
            ver: 1,
            etag: "etag-789",
            createdBy: {
              id: "u7",
              name: "User Seven"
            },
            createdAt: "2024-11-01T14:00:00Z",
            updatedBy: {
              id: "u8",
              name: "User Eight"
            },
            updatedAt: "2024-11-01T15:00:00Z",
            child: "2",
            relationType: "BlockedBy"
          }
        ]
      },
      links: {
        page: "1",
        next: true,
        items: [
          {
            id: "l1",
            ver: 1,
            etag: "etag-321",
            createdBy: {
              id: "u9",
              name: "User Nine"
            },
            createdAt: "2024-11-01T13:00:00Z",
            updatedBy: {
              id: "u10",
              name: "User Ten"
            },
            updatedAt: "2024-11-01T14:00:00Z",
            author: {
              id: "u9",
              name: "User Nine"
            },
            name: "Troubleshooting Guide",
            url: "http://example.com/troubleshooting"
          }
        ]
      },
      sla: {
        id: "sla1",
        name: "Critical SLA"
      }
    },
    {
      id: "2",
      ver: 1,
      etag: "etag-124",
      createdBy: {
        id: "u2",
        name: "User Two"
      },
      createdAt: "2024-11-05T11:00:00Z",
      updatedBy: {
        id: "u3",
        name: "User Three"
      },
      updatedAt: "2024-11-06T11:00:00Z",
      name: "Incident 2",
      subject: "Login Issue",
      description: "Users are unable to log in to the system.",
      contactInfo: "contact2@example.com",
      plannedReactionAt: "2024-11-05T12:00:00Z",
      plannedResolveAt: "2024-11-07T12:00:00Z",
      status: {
        id: "s2",
        name: "In Progress"
      },
      closeReasonGroup: {
        id: "crg2",
        name: "Pending Issues"
      },
      author: {
        id: "u2",
        name: "User Two"
      },
      assignee: {
        id: "u4",
        name: "User Four"
      },
      reporter: {
        id: "u5",
        name: "User Five"
      },
      impacted: {
        id: "dep2",
        name: "Accounts Department"
      },
      group: {
        id: "g2",
        name: "IT Support"
      },
      priority: {
        id: "p2",
        name: "Medium"
      },
      source: {
        id: "src2",
        name: "Phone Call"
      },
      statusCondition: {
        id: "sc2",
        name: "Ongoing"
      },
      close: {
        closeResult: "Pending",
        closeReason: {
          id: "cr2",
          name: "Need More Info"
        }
      },
      rate: {
        rating: "4",
        ratingComment: "Issue is being addressed."
      },
      timing: {
        resolvedAt: "2024-11-07T10:00:00Z",
        reactedAt: "2024-11-05T11:30:00Z",
        differenceInReaction: "30m",
        differenceInResolve: "2d"
      },
      slaCondition: [
        {
          id: "sla2",
          name: "Standard SLA",
          priorities: [
            {
              id: "p2",
              name: "Medium"
            }
          ],
          reactionTime: {
            hours: 2,
            minutes: 0
          },
          resolutionTime: {
            hours: 72,
            minutes: 0
          },
          slaId: "slaId2",
          createdAt: "2024-10-05T10:00:00Z",
          updatedAt: "2024-10-05T12:00:00Z",
          createdBy: {
            id: "u5",
            name: "SLA Manager"
          },
          updatedBy: {
            id: "u6",
            name: "SLA Admin"
          }
        }
      ],
      service: {
        id: "srv2",
        name: "Login Support"
      },
      comments: {
        page: "1",
        next: false,
        items: [
          {
            id: "c2",
            ver: 1,
            etag: "etag-457",
            createdBy: {
              id: "u4",
              name: "User Four"
            },
            createdAt: "2024-11-05T15:00:00Z",
            updatedBy: {
              id: "u5",
              name: "User Five"
            },
            updatedAt: "2024-11-05T16:00:00Z",
            author: {
              id: "u4",
              name: "User Four"
            },
            text: "Looking into the issue.",
            edited: false
          }
        ]
      },
      related: {
        page: "1",
        next: false,
        items: [
          {
            id: "related002",
            ver: 1,
            etag: "relatedEtag002",
            created_by: {
              id: "78912",
              name: "Stanley Hudson",
            },
            created_at: "2024-10-27T10:00:00Z",
            updated_by: {
              id: "78913",
              name: "Phyllis Vance",
            },
            updated_at: "2024-10-28T10:30:00Z",
            child: "Child Issue 002",
            relation_type: "DependsOn",
          },
        ],
      },
      links: {
        page: "1",
        next: false,
        items: [
          {
            id: "link002",
            ver: 1,
            etag: "linkEtag002",
            created_by: {
              id: "78910",
              name: "Michael Scott",
            },
            created_at: "2024-10-26T07:00:00Z",
            updated_by: {
              id: "78911",
              name: "Dwight Schrute",
            },
            updated_at: "2024-10-27T08:00:00Z",
            author: "Michael Scott",
            name: "Network Topology Diagram",
            url: "https://example.com/network-topology",
          },
        ],
      },
      sla: {
        id: "sla2",
        name: "Standard SLA"
      }
    }
  ]
};

const fieldsToSend = [
  'ver',
  'name',
  'subject',
  'description',
  'contact_info',
  'planned_reaction_at',
  'planned_resolve_at',
  'status_lookup',
  'close_reason_lookup',
  'author',
  'assignee',
  'reporter',
  'impacted',
  'group',
  'priority',
  'source',
  'status',
  'close',
  'rate',
  'timing',
  'sla_condition',
  'sla',
  'service',
  'comments',
  'related',
  'links',
  'status_condition'
];


const getList = async (params) => {
  try {
    const { items, next } = applyTransform(data, [
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
    const bucketData = data.items.find((item) => item.id === id);

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

const deleteCase = async ({ etag }) => {
  try {
    const itemIndex = data.items.findIndex((item) => item.etag === etag);

    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    const deletedItem = data.items.splice(itemIndex, 1)[0];

    const transformedResponse = applyTransform(deletedItem, []);

    return new Promise((resolve) => {
      resolve(transformedResponse);
    });
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const updateCase = async ({ itemId: id, itemInstance }) => {
  try {
    const itemIndex = data.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    const transformedItem = applyTransform(itemInstance, [sanitize(fieldsToSend), camelToSnake()]);

    data.items[itemIndex] = {
      ...data.items[itemIndex],
      ...transformedItem,
      updated_at: new Date().toISOString(),
    };

    const updatedItem = applyTransform(data.items[itemIndex], [snakeToCamel()]);

    return new Promise((resolve) => {
      resolve(updatedItem);
    });
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const patchCase = async ({ itemId: id, itemInstance }) => {
  try {
    const itemIndex = data.items.findIndex((item) => item.id === id);

    if (itemIndex === -1) {
      throw new Error("Item not found");
    }

    // Transform the patch data to camelCase and filter for allowed fields
    const transformedPatch = applyTransform(itemInstance, [sanitize(fieldsToSend), camelToSnake()]);

    // Update only the provided fields
    data.items[itemIndex] = {
      ...data.items[itemIndex],
      ...transformedPatch,
      updated_at: new Date().toISOString(),
    };

    const patchedItem = applyTransform(data.items[itemIndex], [snakeToCamel()]);

    return new Promise((resolve) => {
      resolve(patchedItem);
    });
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};

const addCase = async ({ itemInstance }) => {
  try {
    const newCase = applyTransform(itemInstance, [camelToSnake(), sanitize(fieldsToSend)]);

    const newCaseWithDefaults = {
      ...newCase,
      id: String(Date.now()),
      ver: 1,
      etag: `etag-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: {
        id: "system",
        name: "System",
      },
      updated_by: {
        id: "system",
        name: "System",
      },
    };

    data.items.push(newCaseWithDefaults);

    const addedCase = applyTransform(newCaseWithDefaults, []);

    return new Promise((resolve) => {
      resolve(addedCase);
    });
  } catch (err) {
    throw applyTransform(err, [notify]);
  }
};


const casesAPI = {
  getList,
  get,
  delete: deleteCase,
  update: updateCase,
  add: addCase,
  patch: patchCase,
};



export default casesAPI;
