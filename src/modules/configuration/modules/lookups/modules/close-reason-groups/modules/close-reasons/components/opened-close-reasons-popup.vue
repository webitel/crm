<template>
  <wt-popup
    class="opened-close-reasons-popup"
    :shown="!!closeReasonsId"
    size="sm"
    @close="close"
  >
    <template #title>
      {{
        !isNew
          ? t('lookups.closeReasonGroups.editReason')
          : t('lookups.closeReasonGroups.addReason')
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
          :regle-validation="validationFields?.name"
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
import type { WebitelCasesCloseReason } from '@webitel/api-services/gen/models';
import { useNestedCardComponent } from '@webitel/ui-datalist/card';
import { useClose } from '@webitel/ui-sdk/composables';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../../../app/composables/useUserAccessControl';
import { useErrorRedirectHandler } from '../../../../../../../../error-pages/composable/useErrorRedirectHandler';
import { useCaseCloseReasonsCardStore } from '../stores';

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
	validationFields,
	isNew,
	hasValidationErrors,
	save: saveItem,
} = useNestedCardComponent<WebitelCasesCloseReason>({
	useCardStore: useCaseCloseReasonsCardStore,
	routeParamName: 'closeReasonsId',
	parentId: route.params.id as string,
	onLoadErrorHandler: handleError,
});

const closeReasonsId = computed(() => route.params.closeReasonsId);

const { close } = useClose('close-reasons');

const save = async () => {
	await saveItem();
	close();
	emit('load-data');
};
</script>

<style
  lang="scss"
  scoped
></style>
