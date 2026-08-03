<template>
  <wt-popup
    :shown="shown"
    class="communications-popup"
    overflow
    :size="ComponentSize.SM"
    @close="close"
  >
    <template #header>
      {{ popupTitle }}
    </template>
    <template #main>
      <form
        class="communications-popup__form"
        @submit.prevent="save"
      >
        <wt-single-select
          v-model:model-value="modelValue.type"
          :filterable="false"
          :label="t('objects.communicationType', 1)"
          :search-method="searchCommunicationTypes"
          :regle-validation="validationFields.type"
          required
        />
        <wt-input-text
          v-model:model-value="modelValue[destinationField]"
          :label="t('contacts.communications.destination')"
          :regle-validation="validationFields[destinationField]"
          required
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        :disabled="hasValidationErrors"
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

<script setup lang="ts">
import { CommunicationsAPI } from '@webitel/api-services/api';
import type {
	ContactsEmailAddress,
	ContactsPhoneNumber,
} from '@webitel/api-services/gen/models';
import {
	type createCardStore,
	useNestedCardComponent,
} from '@webitel/ui-datalist/card';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { EngineCommunicationChannels } from 'webitel-sdk';

import { CommunicationChannel } from '../enums/CommunicationChannel';

type CommunicationEntity = ContactsEmailAddress & ContactsPhoneNumber;

const props = defineProps<{
	channel:
		| typeof CommunicationChannel.Email
		| typeof CommunicationChannel.Number;
	store: ReturnType<typeof createCardStore>;
	parentId: string;
	isFirstRecord?: boolean;
}>();

const emit = defineEmits<{
	close: [];
	saved: [];
}>();

const { t } = useI18n();
const route = useRoute();

// animate popup appearance after f5 with popup opened
const shown = ref(false);

const communicationOptions = [
	{
		value: CommunicationChannel.Email, // should be same as backend field for destination
		addText: t('contacts.communications.emails.addTitle'),
		updateText: t('contacts.communications.emails.editTitle'),
		filterField: EngineCommunicationChannels.Email,
	},
	{
		value: CommunicationChannel.Number,
		addText: t('contacts.communications.phones.addTitle'),
		updateText: t('contacts.communications.phones.editTitle'),
		filterField: EngineCommunicationChannels.Phone,
	},
];

const currentCommunication = computed(() => {
	return communicationOptions.find((option) => option.value === props.channel);
});

const destinationField = computed(() =>
	props.channel === CommunicationChannel.Email
		? CommunicationChannel.Email
		: CommunicationChannel.Number,
);

const commId = computed(() => route.params.commId as string);

const {
	modelValue,
	validationFields,
	hasValidationErrors,
	isNew,
	save: saveItem,
} = useNestedCardComponent<CommunicationEntity>({
	useCardStore: props.store,
	routeParamName: 'commId',
	parentId: props.parentId,
});

const popupTitle = computed(() =>
	isNew.value
		? currentCommunication.value.addText
		: currentCommunication.value.updateText,
);

function searchCommunicationTypes(params: Record<string, unknown>) {
	return CommunicationsAPI.getLookup({
		...params,
		channel: currentCommunication.value.filterField,
	});
}

const save = async () => {
	if (isNew.value && props.isFirstRecord) {
		modelValue.value.primary = true;
	}
	await saveItem();
	emit('saved');
	close();
};

function close() {
	emit('close');
}

watch(
	commId,
	() => {
		if (commId.value) {
			setTimeout(() => {
				shown.value = !!commId.value;
			}, 300);
		} else {
			shown.value = !!commId.value;
		}
	},
	{
		immediate: true,
	},
);
</script>

<style lang="scss" scoped>
.communications-popup__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}
</style>
