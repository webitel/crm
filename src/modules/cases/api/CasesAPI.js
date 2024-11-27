import applyTransform, {
  camelToSnake,
  merge,
  notify, sanitize,
  snakeToCamel,
} from '@webitel/ui-sdk/src/api/transformers/index.js';
import getDefaultGetListResponse from '../../../app/api/defaults/getDefaultGetListResponse.js';

// NOTE: local version of API and need to be deleted after the API is created in the backend

const data = {
  page: "1",
  next: true,
  items: [
    {
      id: "12345",
      ver: 1,
      etag: "abc123etag",
      created_by: {
        id: "67890",
        name: "John Doe",
      },
      created_at: "2024-10-25T12:00:00Z",
      updated_by: {
        id: "67891",
        name: "Jane Smith",
      },
      updated_at: "2024-10-26T12:00:00Z",
      name: "Sample Task",
      subject: "System Outage",
      description: "Detailed description of the system outage.",
      contact_info: "john.doe@example.com",
      planned_reaction_at: "2024-10-27T14:00:00Z",
      planned_resolve_at: "2024-10-28T16:00:00Z",
      status_lookup: {
        id: "status001",
        name: "In Progress",
      },
      close_reason_lookup: {
        id: "reason001",
        name: "Resolved",
      },
      author: {
        id: "author001",
        name: "Alice Brown",
      },
      assignee: {
        id: "assignee001",
        name: "Bob Green",
      },
      reporter: {
        id: "reporter001",
        name: "Charlie White",
      },
      impacted: {
        id: "impacted001",
        name: "Operations",
      },
      group: {
        id: "group001",
        name: "Support Team",
      },
      priority: {
        id: "priority001",
        name: "High",
      },
      source: {
        id: "source001",
        name: "Internal",
      },
      status: {
        id: "status001",
        name: "Open",
      },
      close: {
        close_result: "Fixed",
        close_reason: {
          id: "reason001",
          name: "Resolved Issue",
        },
      },
      rate: {
        rating: "5",
        rating_comment: "Great service!",
      },
      timing: {
        resolved_at: "2024-10-28T18:00:00Z",
        reacted_at: "2024-10-27T15:00:00Z",
        difference_in_reaction: "1 hour",
        difference_in_resolve: "2 days",
      },
      sla_condition: [
        {
          id: "sla001",
          name: "High Priority SLA",
          priorities: [
            {
              id: "priority001",
              name: "High",
            },
          ],
          reaction_time: {
            hours: 1,
            minutes: 30,
          },
          resolution_time: {
            hours: 48,
            minutes: 0,
          },
          sla_id: "sla001",
          created_at: "2024-10-24T10:00:00Z",
          updated_at: "2024-10-25T11:00:00Z",
          created_by: {
            id: "67890",
            name: "John Doe",
          },
          updated_by: {
            id: "67891",
            name: "Jane Smith",
          },
        },
      ],
      service: {
        id: "service001",
        name: "IT Support",
        root_id: "root123",
        description: "IT support services",
        code: "IT-SUPPORT",
        state: true,
        sla: {
          id: "sla001",
          name: "Standard SLA",
        },
        group: {
          id: "group001",
          name: "Support Team",
        },
        assignee: {
          id: "assignee002",
          name: "Sally Blue",
        },
        created_at: "2024-10-24T09:30:00Z",
        updated_at: "2024-10-25T10:30:00Z",
        created_by: {
          id: "67890",
          name: "John Doe",
        },
        updated_by: {
          id: "67891",
          name: "Jane Smith",
        },
        catalog_id: "catalog123",
        service: [{}],
      },
      comments: {
        page: "1",
        next: false,
        items: [
          {
            id: "comment001",
            ver: 1,
            etag: "commentEtag001",
            created_by: {
              id: "67890",
              name: "John Doe",
            },
            created_at: "2024-10-25T13:00:00Z",
            updated_by: {
              id: "67891",
              name: "Jane Smith",
            },
            updated_at: "2024-10-26T13:30:00Z",
            author: {
              id: "67890",
              name: "John Doe",
            },
            text: "Initial analysis shows a possible server overload.",
            edited: true,
          },
        ],
      },
      related: {
        page: "1",
        next: false,
        items: [
          {
            id: "related001",
            ver: 1,
            etag: "relatedEtag001",
            created_by: {
              id: "67892",
              name: "Frank Red",
            },
            created_at: "2024-10-25T15:00:00Z",
            updated_by: {
              id: "67893",
              name: "Grace Orange",
            },
            updated_at: "2024-10-26T15:30:00Z",
            child: "Child Issue 001",
            relation_type: "BlockedBy",
          },
        ],
      },
      links: {
        page: "1",
        next: false,
        items: [
          {
            id: "link001",
            ver: 1,
            etag: "linkEtag001",
            created_by: {
              id: "67890",
              name: "John Doe",
            },
            created_at: "2024-10-24T08:00:00Z",
            updated_by: {
              id: "67891",
              name: "Jane Smith",
            },
            updated_at: "2024-10-25T09:00:00Z",
            author: "John Doe",
            name: "System Architecture Diagram",
            url: "https://example.com/diagram",
          },
        ],
      },
    },
    {
      id: "54321",
      ver: 2,
      etag: "xyz789etag",
      created_by: {
        id: "78910",
        name: "Michael Scott",
      },
      created_at: "2024-10-27T08:00:00Z",
      updated_by: {
        id: "78911",
        name: "Dwight Schrute",
      },
      updated_at: "2024-10-28T08:00:00Z",
      name: "Follow-up Task",
      subject: "Network Maintenance",
      description: "Details about scheduled network maintenance.",
      contact_info: "michael.scott@example.com",
      planned_reaction_at: "2024-10-29T10:00:00Z",
      planned_resolve_at: "2024-10-30T12:00:00Z",
      status_lookup: {
        id: "status002",
        name: "Scheduled",
      },
      close_reason_lookup: {
        id: "reason002",
        name: "Maintenance Completed",
      },
      author: {
        id: "author002",
        name: "Jim Halpert",
      },
      assignee: {
        id: "assignee002",
        name: "Pam Beesly",
      },
      reporter: {
        id: "reporter002",
        name: "Ryan Howard",
      },
      impacted: {
        id: "impacted002",
        name: "IT Department",
      },
      group: {
        id: "group002",
        name: "Network Team",
      },
      priority: {
        id: "priority002",
        name: "Medium",
      },
      source: {
        id: "source002",
        name: "External",
      },
      status: {
        id: "status002",
        name: "Pending",
      },
      close: {
        close_result: "Maintenance Completed",
        close_reason: {
          id: "reason002",
          name: "Scheduled Maintenance",
        },
      },
      rate: {
        rating: "4",
        rating_comment: "Good work!",
      },
      timing: {
        resolved_at: "2024-10-30T15:00:00Z",
        reacted_at: "2024-10-29T11:00:00Z",
        difference_in_reaction: "3 hours",
        difference_in_resolve: "2 days",
      },
      sla_condition: [
        {
          id: "sla002",
          name: "Medium Priority SLA",
          priorities: [
            {
              id: "priority002",
              name: "Medium",
            },
          ],
          reaction_time: {
            hours: 2,
            minutes: 0,
          },
          resolution_time: {
            hours: 72,
            minutes: 0,
          },
          sla_id: "sla002",
          created_at: "2024-10-26T09:00:00Z",
          updated_at: "2024-10-27T10:00:00Z",
          created_by: {
            id: "78910",
            name: "Michael Scott",
          },
          updated_by: {
            id: "78911",
            name: "Dwight Schrute",
          },
        },
      ],
      service: {
        id: "service002",
        name: "Network Services",
        root_id: "root456",
        description: "Network maintenance services",
        code: "NETWORK-SERV",
        state: true,
        sla: {
          id: "sla002",
          name: "Extended SLA",
        },
        group: {
          id: "group002",
          name: "Network Team",
        },
        assignee: {
          id: "assignee003",
          name: "Angela Martin",
        },
        created_at: "2024-10-26T08:30:00Z",
        updated_at: "2024-10-27T09:30:00Z",
        created_by: {
          id: "78910",
          name: "Michael Scott",
        },
        updated_by: {
          id: "78911",
          name: "Dwight Schrute",
        },
        catalog_id: "catalog456",
        service: [{}],
      },
      comments: {
        page: "1",
        next: false,
        items: [
          {
            id: "comment002",
            ver: 1,
            etag: "commentEtag002",
            created_by: {
              id: "78910",
              name: "Michael Scott",
            },
            created_at: "2024-10-27T09:00:00Z",
            updated_by: {
              id: "78911",
              name: "Dwight Schrute",
            },
            updated_at: "2024-10-28T09:30:00Z",
            author: {
              id: "78910",
              name: "Michael Scott",
            },
            text: "Maintenance scheduled to improve network reliability.",
            edited: false,
          },
        ],
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
    },
  ],
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
  'service',
  'comments',
  'related',
  'links',
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

const addCase = async ({ itemInstance }) => {
  try {
    const newCase = applyTransform(itemInstance, [sanitize(fieldsToSend), camelToSnake()]);

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

    const addedCase = applyTransform(newCaseWithDefaults, [snakeToCamel()]);

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
};



export default casesAPI;
