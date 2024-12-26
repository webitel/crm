export const serviceCatalogData  = {
  catalog: {
    id: 'catalog1',
    name: 'Main Catalogqwe',
    description: 'This is the main service catalog.',
    prefix: 'CAT',
    code: 'CAT001',
    state: true,
    sla: {
      id: 'sla1',
      name: 'Standard SLA',
    },
    status: {
      id: 's2',
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
                  id: 'sla1',
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
  service: {
    id: 'subservice2',
    name: 'Router Configuratioasdn',
    rootId: 'root3',
    description: 'Guidance on router setup and troubleshooting.',
    code: 'RT001',
    state: true,
    sla: {
      id: 'sla1',
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
};
