import type { DataField } from '@webitel/api-services/gen/models';
import { ref } from 'vue';

// dynamic field definitions for the currently open dictionary (:repo route
// param), read by customLookup.validations.ts, set by
// the-custom-lookup.vue / opened-custom-lookup.vue on repo change
export const customLookupFields = ref<DataField[]>([]);
