<template>
  <wt-popup
    class="opened-status-condition-popup"
    :shown="!!statusConditionId"
    size="sm"
    overflow
    @close="close"
  >
    <template #title>
      {{
        !isNew
          ? t('lookups.statuses.editStatus')
          : t('lookups.statuses.addStatus')
      }}
    </template>

    <template #main>
      <form
        class="opened-card-input-grid opened-card-input-grid--1-col"
        @submit.prevent="save"
      >
        <wt-input-text
          :model-value="draftItemInstance.name"
          :label="t('reusable.name')"
          :regle-validation="validationSchema.r$.name"
          :disabled="disableUserInput"
          required
          @update:model-value="draftItemInstance.name = $event"
        />

        <wt-textarea
          :label="t('vocabulary.description')"
          :model-value="draftItemInstance.description"
          :disabled="disableUserInput"
          @update:model-value="draftItemInstance.description = $event"
        />
      </form>
    </template>

    <template #actions>
      <wt-button
        :disabled="!hasSaveActionAccess || isSaveDisabled"
        @click="save"
      >
        {{ t('reusable.save') }}
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

<script lang="ts" setup>
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { useCaseStatusConditionsCardStore } from '../stores';

const emit = defineEmits([
	'load-data',
]);

const route = useRoute();
const { t } = useI18n();

const { disableUserInput, hasSaveActionAccess } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});

const cardStore = useCaseStatusConditionsCardStore();

const { draftItemInstance, validationSchema, isLoading, isSaving } =
	storeToRefs(cardStore);
const { initialize, saveItem, $reset } = cardStore;

const statusConditionId = computed(() => route.params.statusConditionId);
const isNew = computed(() => statusConditionId.value === 'new');
const parentId = computed(() => route.params.id);

const { close } = useClose('status-conditions');

const isSaveDisabled = computed(
	() => validationSchema.value.r$.$invalid || isSaving.value || isLoading.value,
);

const save = async () => {
	const { valid } = await validationSchema.value.r$.$validate();
	if (!valid) return;

	await saveItem(draftItemInstance.value);
	close();
	emit('load-data');
};

async function initializePopup() {
	await initialize({
		itemId: isNew.value ? undefined : statusConditionId.value,
		parentId: parentId.value,
	});
}

watch(
	statusConditionId,
	(value) => {
		if (value) {
			initializePopup();
		} else {
			$reset();
		}
	},
	{
		immediate: true,
	},
);
</script>

<style lang="scss" scoped></style>
