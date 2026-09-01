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
        :item-instance="props.itemInstance"
        :regle-validation="props.validationFields?.custom?.[field.id]"
        path-to-field="custom"
        timezone="utc"
      />
    </div>
    <div
      v-else
      class="opened-card-input-grid opened-card-input-grid--2-col opened-card-input-grid--w50 case-details-container"
    >
      <field-extension-display
        v-for="field in fields"
        :key="field.id"
        :field="field"
        :value="get(props.itemInstance, `custom.${field.id}`)"
      />
    </div>
  </template>
</template>

<script
  setup
  lang="ts"
>
import { CrmSections } from '@webitel/ui-sdk/enums';
import get from 'lodash/get';
import { watch } from 'vue';
import { useRouter } from 'vue-router';
import FieldExtensionDisplay from '../../../../configuration/modules/customization/modules/field-extensions/components/field-extension-display.vue';
import CustomLookupDynamicField from '../../../../configuration/modules/lookups/modules/custom-lookup/components/custom-lookup-dynamic-field.vue';
import { useCaseAccessState } from '../../../composables/useCaseAccessState';

const router = useRouter();

const { isEditable } = useCaseAccessState();

const props = defineProps<{
	fields: Array<Record<string, any>>;
	itemInstance: Record<string, any>;
	validationFields?: Record<string, any>;
}>();

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
