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
          v-model:model-value="modelValue.name"
          :label="t('reusable.name')"
          :regle-validation="validationSchema.r$.name"
          :disabled="disableUserInput"
          required
        />

        <wt-textarea
          v-model:model-value="modelValue.description"
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
import { useCardComponent } from '@webitel/ui-datalist/card';
import { useClose } from '@webitel/ui-sdk/composables';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { WtTextarea } from '@webitel/ui-sdk/components';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useCaseStatusConditionsCardStore } from '../stores';

const emit = defineEmits([
	'load-data',
]);

const route = useRoute();
const { t } = useI18n();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl({
	useUpdateAccessAsAllMutableChecksSource: true,
});

const { handleError } = useErrorRedirectHandler();

const {
	modelValue,
	isNew,
	hasValidationErrors,
	save: saveItem,
} = useCardComponent({
	useCardStore: useCaseStatusConditionsCardStore,
	routeParamName: 'statusConditionId',
	onLoadErrorHandler: handleError,
});

const { validationSchema } = storeToRefs(useCaseStatusConditionsCardStore());

const statusConditionId = computed(() => route.params.statusConditionId);

const { close } = useClose('status-conditions');

const save = async () => {
	await saveItem();
	close();
	emit('load-data');
};
</script>

<style lang="scss" scoped></style>
