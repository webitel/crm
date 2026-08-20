<template>
  <template>
    <div
      v-if="isEditable"
      class="opened-card-input-grid opened-card-input-grid--2-col opened-card-input-grid--w50 case-details-container"
    >
      <custom-lookup-dynamic-field
        v-for="field in fields"
        :key="field.id"
        :field="field"
        :namespace="CasesCardNamespace"
        path-to-field="custom"
        timezone="utc"
      />
    </div>
    <div
      v-else
      class="opened-card-input-grid opened-card-input-grid--2-col opened-card-input-grid--w50 case-details-container"
    >
      <wt-display-content
        v-for="field in fields"
        :key="field.id"
        :field="field"
        :value="get(itemInstance, `custom.${field.id}`)"
      />
    </div>
  </template>
</template>

<script
  setup
  lang="ts"
>
import { CrmSections } from '@webitel/ui-sdk/enums';
import { useCardStore } from '@webitel/ui-sdk/store';
import get from 'lodash/get';
import { watch } from 'vue';
import { useRouter } from 'vue-router';

import CustomLookupDynamicField from '../../../../configuration/modules/lookups/modules/custom-lookup/components/custom-lookup-dynamic-field.vue';
import WtDisplayContent from '../../../../customization/modules/wt-type-extension/components/wt-display-content.vue';
import { useCaseAccessState } from '../../../composables/useCaseAccessState';
import { CasesCardNamespace } from '../../../namespace';

const router = useRouter();

const { isEditable } = useCaseAccessState();

const props = defineProps<{
	fields: Array<Record<string, any>>;
}>();
const { itemInstance } = useCardStore(CasesCardNamespace);

watch(
	() => props.fields,
	() => {
		if (!props.fields.length) {
			router.push({
				name: `${CrmSections.Cases}-case-info`,
			});
		}
	},
);
</script>

<style
  scoped
  lang="scss"
>
.case-details-container {
  max-height: fit-content;
}
</style>
