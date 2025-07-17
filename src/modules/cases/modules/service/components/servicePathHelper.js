import CatalogAPI from '../api/CatalogAPI.js';
import ServiceAPI from '../api/ServiceAPI.js';

// Простий кеш для уникнення повторних запитів для однакових сервісів
const servicePathCache = new Map();

// Знаходить батьківський сервіс
function findParentService(currentService, parentServices) {
  for (const parent of parentServices) {
    if (parent.service?.some((child) => child.id === currentService.id))
      return parent;
    const foundParent =
      parent.service && findParentService(currentService, parent.service);
    if (foundParent) return foundParent;
  }
  return null;
}

// Будує масив шляху
function buildServicePath(service, catalog) {
  const path = [];
  let currentService = service;

  while (currentService) {
    path.unshift(currentService.name);
    currentService = findParentService(currentService, catalog.service || []);
  }

  path.unshift(catalog.name);
  return path;
}

// Генерує рядок шляху
function generateServicePath(service, catalog) {
  if (!service || !catalog) {
    console.error('Invalid service or catalog data');
    return '';
  }
  const pathArray = buildServicePath(service, catalog);
  return pathArray.join(' / ');
}

/**
 * Основна експортована функція.
 * Отримує дані про сервіс та каталог, будує повний шлях та кешує результат.
 * @param {string} serviceId - ID сервісу.
 * @returns {Promise<string>} - Повний шлях сервісу.
 */
export const fetchAndBuildServicePath = async (serviceId) => {
  if (!serviceId) return '';
  if (servicePathCache.has(serviceId)) {
    return servicePathCache.get(serviceId);
  }

  try {
    const service = await ServiceAPI.get({ itemId: serviceId });
    if (!service?.catalogId) return service.name || ''; // Повертаємо ім'я, якщо каталогу немає

    const catalog = await CatalogAPI.get({ itemId: service.catalogId });
    const path = generateServicePath(service, catalog);

    servicePathCache.set(serviceId, path); // Зберігаємо результат в кеш
    return path;
  } catch (err) {
    console.error(`Failed to fetch service path for ID ${serviceId}:`, err);
    return '...'; // Повертаємо плейсхолдер у випадку помилки
  }
};
