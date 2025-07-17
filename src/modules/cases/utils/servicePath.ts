// Helper to build the hierarchical path for a service within a catalog

export interface Service {
  id: string | number;
  name: string;
  service?: Service[]; // children
}

export interface Catalog {
  id: string | number;
  name: string;
  service?: Service[];
}

// Recursively finds the parent service for the given service within a list of parent services
function findParentService(currentService: Service, parentServices: Service[]): Service | null {
  for (const parent of parentServices) {
    if (parent.service?.some(child => child.id === currentService.id)) {
      return parent;
    }
    const foundParent = parent.service && findParentService(currentService, parent.service);
    if (foundParent) return foundParent;
  }
  return null;
}

// Builds the hierarchical path for the service within the catalog
function buildServicePath(service: Service, catalog: Catalog): string[] {
  const path: string[] = [];
  let currentService: Service | null = service;

  while (currentService) {
    path.unshift(currentService.name);
    currentService = findParentService(currentService, catalog.service || []);
  }

  path.unshift(catalog.name);
  return path;
}

// Generates the service path as a string
export function generateServicePath(service: Service, catalog: Catalog): string {
  if (!service || !catalog) {
    // eslint-disable-next-line no-console
    console.error('Invalid service or catalog data');
    return '';
  }
  const pathArray = buildServicePath(service, catalog);
  return pathArray.join(' / ');
} 