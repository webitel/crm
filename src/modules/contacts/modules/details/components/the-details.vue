<template>
  <teleport
    v-if="hasEditAccess && !isReadOnly"
    to="#page-header-actions"
  >
    <wt-button
      :disabled="disabledSave"
      @click="saveDetails"
    >{{ t('reusable.save') }}</wt-button>
  </teleport>
  <div class="opened-card wt-scrollbar">
    <div class="opened-card-form">
      <div
        v-if="hasEditAccess"
        class="opened-card-input-grid opened-card-input-grid--2-col opened-card-input-grid--w100"
      >
        <custom-lookup-dynamic-field
          v-for="field in fields"
          :key="field.id"
          :field="field"
          :item-instance="props.itemInstance"
          :regle-validation="props.validationFields?.custom?.[field.id]"
          :disabled="isReadOnly"
          path-to-field="custom"
        />
      </div>
      <div
        v-else
        class="opened-card-input-grid opened-card-input-grid--2-col opened-card-input-grid--w50"
      >
        <wt-display-content
          v-for="field in fields"
          :key="field.id"
          :field="field"
          :value="get(props.itemInstance, `custom.${field.id}`)"
        />
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { CrmSections } from '@webitel/ui-sdk/enums';
import get from 'lodash/get';
import { type ComputedRef, computed, inject, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import CustomLookupDynamicField from '../../../../configuration/modules/lookups/modules/custom-lookup/components/custom-lookup-dynamic-field.vue';
import WtDisplayContent from '../../../../customization/modules/wt-type-extension/components/wt-display-content.vue';
import { useContactCardStore } from '../../../stores/card/contactCardStore';

const access =
	inject<
		ComputedRef<{
			hasRbacEditAccess?: boolean;
		}>
	>('access');
const isReadOnly = inject<boolean>('isReadOnly');

const props = defineProps<{
	fields: Array<Record<string, any>>;
	itemInstance: Record<string, any>;
	validationFields?: Record<string, any>;
}>();

const hasEditAccess = computed(() => access.value?.hasRbacEditAccess);

const router = useRouter();
const { t } = useI18n();

const { saveItem } = useContactCardStore();

const disabledSave = computed(() => isReadOnly);

const saveDetails = () => {
	saveItem(props.itemInstance);
};

watch(
	() => props.fields,
	() => {
		if (!props.fields.length) {
			router.push({
				name: `${CrmSections.Contacts}-timeline`,
			});
		}
	},
);
</script>

<style
  scoped
  lang="scss"
>
.opened-card {
  height: 100%;
  overflow-y: auto;
  padding-right: var(--spacing-2xs);
}
</style>
