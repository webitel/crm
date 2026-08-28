<template>
  <wt-popup
    :shown="shown"
    @close="close"
    class="wt-cases-export-type-popup"
  >
    <template #header>
      {{ t('reusable.export') }}
    </template>
    <template #main>
      <div class="wt-cases-export-type-popup__form">
        <wt-single-select
          v-model:model-value="draft.type"
          :label="t('vocabulary.format')"
          required
          :regle-validation="validationFields.type"
          data-key="name"
          :options="options"
        />
        <wt-input-text
          v-if="isExportSettingsFormatCSV"
          v-model:model-value="draft.separator"
          :label="t('objects.CSV.separator')"
          :regle-validation="validationFields.separator"
          required
        />
      </div>
    </template>
    <template #actions>
      <wt-button
        :disabled="hasValidationErrors"
        @click="save"
      >
        {{ t('reusable.export') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.close') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import { useRegleSchema } from '@regle/schemas';
import {
	type CaseExportOptions,
	caseExportOptionsSchema,
} from '@webitel/api-services/validations';
import { FileFormat } from '@webitel/ui-sdk/scripts';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
	shown: boolean;
}>();

const emit = defineEmits<{
	save: [
		{
			format?: FileFormat;
			separator?: string;
		},
	];
	close: [];
}>();

const { t } = useI18n();

const draft = ref<CaseExportOptions>({
	type: null,
	separator: ',',
});

const options = ref([
	{
		name: 'csv',
		value: FileFormat.CSV,
	},
	{
		name: 'xlsx',
		value: FileFormat.XLSX,
	},
]);

const isExportSettingsFormatCSV = computed(
	() => draft.value.type?.value === 'csv',
);

const validationSchema = ref(
	useRegleSchema(draft, caseExportOptionsSchema, {
		autoDirty: true,
		syncState: {
			onValidate: true,
		},
	}),
);

const validationFields = computed(() => validationSchema.value.r$.$fields);
const hasValidationErrors = computed(() => validationSchema.value.r$.$error);
const validate = () => validationSchema.value.r$.$validate();

const save = async () => {
	const { valid, data } = await validate();
	if (!valid) return;

	emit('save', {
		format: data.type?.value as FileFormat | undefined,
		separator: data.separator,
	});
	close();
};

const close = () => {
	emit('close');
};
</script>

<style lang="scss" scoped>
.wt-cases-export-type-popup {
  min-height: 200px;

  :deep(.wt-popup__main) {
    overflow-y: initial !important;
  }

  :deep(.wt-popup__popup) {
    max-width: 500px;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
}
</style>
