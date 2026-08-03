<template>
  <wt-popup
    :shown="shown"
    :size="ComponentSize.SM"
    overflow
    @close="close"
  >
    <template #header>
      {{ popupTitle }}
    </template>
    <template #main>
      <form
        class="variable-popup__form"
        @submit.prevent="save"
      >
        <wt-input-text
          v-model:model-value="modelValue.key"
          :label="t('vocabulary.keys', 1)"
          :regle-validation="validationFields.key"
          required
        />
        <wt-input-text
          v-model:model-value="modelValue.value"
          :label="t('vocabulary.values', 1)"
          :regle-validation="validationFields.value"
          required
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        :disabled="hasValidationErrors"
        @click="save"
      >
        {{ isNew ? t('reusable.add') : t('reusable.edit') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>
</template>

<script setup lang="ts">
import type { ContactsVariable } from '@webitel/api-services/gen/models';
import { useNestedCardComponent } from '@webitel/ui-datalist/card';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useVariablesCardStore } from '../stores/card/variablesCardStore';

const props = defineProps<{
	parentId: string;
}>();

const emit = defineEmits<{
	close: [];
	saved: [];
}>();

const { t } = useI18n();
const route = useRoute();

// animate popup appearance after f5 with popup opened
const shown = ref(false);

const variableId = computed(() => route.params.variableId as string);

const {
	modelValue,
	validationFields,
	hasValidationErrors,
	isNew,
	save: saveItem,
} = useNestedCardComponent<ContactsVariable>({
	useCardStore: useVariablesCardStore,
	routeParamName: 'variableId',
	parentId: props.parentId,
});

const popupTitle = computed(
	() =>
		`${isNew.value ? t('reusable.add') : t('reusable.edit')} ${t('contacts.attributes', 1).toLowerCase()}`,
);

const save = async () => {
	await saveItem();
	emit('saved');
	close();
};

function close() {
	emit('close');
}

watch(
	variableId,
	() => {
		if (variableId.value) {
			setTimeout(() => {
				shown.value = !!variableId.value;
			}, 300);
		} else {
			shown.value = !!variableId.value;
		}
	},
	{
		immediate: true,
	},
);
</script>

<style lang="scss" scoped>
.variable-popup__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
