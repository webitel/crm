import { WtTypeExtensionAPI } from '@webitel/api-services/api';
import { snakeToCamel } from '@webitel/api-services/utils';
import get from 'lodash-es/get';
import { computed, ref, watch } from 'vue';

import { headers as baseHeadersConfig } from '../store/_internals/headers';

export function useCasesCustomHeaders({ headers, updateShownHeaders }) {
	// Reactive reference for custom headers from API
	const customHeaders = ref([]);
	const customHeadersLoaded = ref(false);

	// Helper function to filter out duplicate headers based on field property
	const filterUniqueHeaders = (headersToFilter, existingHeaders) => {
		const existingFields = new Set(
			existingHeaders.map((header) => header.field),
		);
		return headersToFilter.filter((h) => !existingFields.has(h.field));
	};

	// Computed property that combines base headers with custom headers
	const mergedHeaders = computed(() => {
		const baseHeaders = headers.value || [];

		// Return only base headers if custom headers aren't loaded yet
		if (!customHeadersLoaded.value) return baseHeaders;

		// Get unique custom headers that don't conflict with base headers
		const uniqueCustom = filterUniqueHeaders(customHeaders.value, baseHeaders);
		return [
			...baseHeaders,
			...uniqueCustom,
		];
	});

	// Helper function to create a single header object from API field data
	const createHeaderFromField = (field) => ({
		value: snakeToCamel(field?.name),
		show: false,
		kind: field.kind,
		field: field.id,
		locale: field.name,
	});

	// Helper function to transform API field objects into table header format
	const transformFieldsToHeaders = (fields) => {
		if (!Array.isArray(fields)) return [];
		return fields.map(createHeaderFromField);
	};

	// Helper function to extract custom field value from item data
	const getCustomValues = (item, header) =>
		// Boolean fields are stored by field ID, other fields by field (camelCase)
		get(item, [
			'custom',
			header.field,
		]);

	// Helper function to fetch custom headers from API
	const fetchCustomHeadersFromAPI = async () => {
		const response = await WtTypeExtensionAPI.getList({
			itemId: 'cases',
		});
		return response?.fields || [];
	};

	// Helper function to merge headers and update store
	const updateHeaders = (headersToAdd, baseHeaders?) => {
		const existing = baseHeaders || headers.value || [];
		const unique = filterUniqueHeaders(headersToAdd, existing);

		if (unique.length) {
			updateShownHeaders([
				...existing,
				...unique,
			]);
		}
	};

	// Main function to load and integrate custom headers
	const loadCustomHeaders = async () => {
		// Fetch fields from API
		const fields = await fetchCustomHeadersFromAPI();

		// Transform API fields to header format
		const transformed = transformFieldsToHeaders(fields);
		customHeaders.value = transformed;
		customHeadersLoaded.value = true;

		// Merge with existing headers and update store if we have any custom headers
		if (transformed.length) updateHeaders(transformed);
	};

	// https://webitel.atlassian.net/browse/WTEL-9014
	const removeOutdatedCustomHeaders = () => {
		if (!customHeadersLoaded.value) return;

		const validFields = new Set([
			...baseHeadersConfig.map((h) => h.field),
			...customHeaders.value.map((h) => h.field),
		]);

		const current = headers.value;

		// Check if any current headers reference fields no longer in base or custom config
		const hasOutdated = current.some((h) => !validFields.has(h.field));

		if (hasOutdated) {
			// Keep only headers that still exist in base or custom config
			updateShownHeaders(current.filter((h) => validFields.has(h.field)));
		}
	};

	// Helper function to sync missing custom headers
	const syncMissingCustomHeaders = (newHeaders) => {
		if (!customHeadersLoaded.value || !newHeaders) return;

		// Use the same merge function but with reversed parameters
		updateHeaders(customHeaders.value, newHeaders);
	};

	// Keep custom headers in sync when base headers change
	watch(() => headers.value, syncMissingCustomHeaders, {
		deep: true,
	});

	watch(customHeadersLoaded, (isLoaded) => {
		if (!isLoaded) return;

		// "updateHeaders" doesnt mix in custom headers if those are present (already restored) in headers
		const notInitialized = headers.value.filter((h) => h.shouldBeInitialized);
		if (!notInitialized.length) return;

		// ... so, we can just extend those restored (but not initialized yet) headers with custom headers
		notInitialized.forEach((header) => {
			const customHeader = customHeaders.value.find(
				(c) => c.field === header.field,
			);
			Object.assign(header, {
				...customHeader,
				shouldBeInitialized: false,
				show: true,
			});
		});
	});

	return {
		customHeaders,
		customHeadersLoaded,
		mergedHeaders,
		loadCustomHeaders,
		removeOutdatedCustomHeaders,
		getCustomValues,
	};
}
