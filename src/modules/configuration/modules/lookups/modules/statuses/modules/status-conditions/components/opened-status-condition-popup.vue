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
          v-model="draftItemInstance.name"
          :label="t('reusable.name')"
          :regle-validation="validationSchema.r$.name"
          :disabled="disableUserInput"
          required
        />

        <wt-textarea
          v-model="draftItemInstance.description"
          :label="t('vocabulary.description')"
          :disabled="disableUserInput"
        />
      </form>
    </template>

    <template #actions>
      <wt-button
        :disabled="!hasSaveActionAccess || hasValidationErrors"
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
import { useClose } from '@webitel/ui-sdk/composables';
import { storeToRefs } from 'pinia';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { useCaseStatusConditionsCardStore } from '../stores';
import { useCardIsNew, useCardValidation } from '@webitel/ui-datalist/card';

const emit = defineEmits([
	'load-data',
]);

const route = useRoute();
const { t } = useI18n();

const { disableUserInput, hasSaveActionAccess } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});

const cardStore = useCaseStatusConditionsCardStore();

const { draftItemInstance, validationSchema } = storeToRefs(cardStore);
const { hasValidationErrors, validate } = useCardValidation({
	validationSchema,
});
const { initialize, saveItem, $reset } = cardStore;

const statusConditionId = computed(() => route.params.statusConditionId);

const { isNew } = useCardIsNew({
	itemId: statusConditionId.value,
});

const parentId = computed(() => route.params.id);

const { close } = useClose('status-conditions');

const save = async () => {
	const { valid, data } = await validate();
	if (!valid) return;

	await saveItem(data);
	close();
	emit('load-data');
};

async function initializePopup() {
	await initialize({
		itemId: isNew.value ? null : statusConditionId.value,
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
