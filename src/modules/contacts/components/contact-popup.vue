<template>
  <wt-popup
    class="contact-popup"
    :shown="shown"
    :size="ComponentSize.SM"
    @close="close"
  >
    <template #title>
      {{ props.id ? t('reusable.edit') : t('reusable.new') }}
      {{ t('contacts.contact', 1).toLowerCase() }}
    </template>

    <template #main>
      <form class="contact-popup-form">
        <wt-input-text
          v-model:model-value="modelValue.name"
          :label="t('reusable.name')"
          :regle-validation="validationFields.name"
          required
          prevent-trim
        />

        <wt-multi-select
          v-model:model-value="modelValue.groups"
          :label="t('cases.groupPerformers')"
          :search-method="loadStaticContactGroupsList"
        />

        <wt-single-select
          :model-value="modelValue.timezones?.[0]?.timezone"
          :label="t('date.timezone', 1)"
          :search-method="CalendarsAPI.getTimezonesLookup"
          @update:model-value="modelValue.timezones = [{ timezone: $event }]"
        />

        <wt-single-select
          :model-value="modelValue.managers?.[0]?.user"
          :label="t('contacts.manager', 1)"
          :search-method="UsersAPI.getLookup"
          @update:model-value="modelValue.managers = [{ user: $event }]"
        />

        <wt-multi-select
          v-model:model-value="modelValue.labels"
          :label="t('vocabulary.labels', 1)"
          :search-method="LabelsAPI.getList"
          option-label="label"
					chips-view
          data-key="label"
          allow-custom-values
        />

        <wt-textarea
          v-model:model-value="modelValue.about"
          :label="t('vocabulary.description')"
        />
      </form>
    </template>

    <template #actions>
      <wt-button
        :disabled="hasValidationErrors"
        :loading="isSaving"
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
import { useRegleSchema } from '@regle/schemas';
import {
	CalendarsAPI,
	type ContactEntity,
	ContactGroupsAPI,
	ContactsAPI,
	LabelsAPI,
	UsersAPI,
} from '@webitel/api-services/api';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { contactSchema } from '@webitel/api-services/validations';
import { ComponentSize } from '@webitel/ui-sdk/enums';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useUserinfoStore } from '../../userinfo/store/userinfoStore';

const props = withDefaults(
	defineProps<{
		// if id is passed, that's an edit
		id?: string | null;
		shown?: boolean;
	}>(),
	{
		id: null,
		shown: false,
	},
);
const emit = defineEmits<{
	saved: [
		id: string,
	];
	close: [];
}>();

const { t } = useI18n();

const userInfoStore = useUserinfoStore();

function generateNewDraft(): ContactEntity {
	return {
		name: '',
		timezones: [],
		managers: [
			{
				user: {
					id: userInfoStore.userInfo?.userId,
					name: userInfoStore.userInfo?.name,
				},
			},
		],
		labels: [],
		groups: [],
		about: '',
	};
}

const draft = ref<ContactEntity>(generateNewDraft());

const validationSchema = ref(
	useRegleSchema(draft, contactSchema, {
		autoDirty: true,
		syncState: {
			onValidate: true,
		},
	}),
);

const modelValue = computed(() => validationSchema.value.r$.$value);
const validationFields = computed(() => validationSchema.value.r$.$fields);
const hasValidationErrors = computed(() => validationSchema.value.r$.$error);
const validate = () => validationSchema.value.r$.$validate();

const isSaving = ref(false);

function close() {
	emit('close');
}

async function save() {
	const { valid, data } = await validate();
	if (!valid) return;

	isSaving.value = true;
	try {
		let id = props.id;
		if (props.id) {
			await ContactsAPI.update({
				itemInstance: {
					...data,
					id: props.id,
				},
			});
		} else {
			const newContact = await ContactsAPI.add({
				itemInstance: data,
			});
			id = newContact.id;
		}
		if (id) emit('saved', id);
		close();
	} finally {
		isSaving.value = false;
	}
}

async function loadItem(id = props.id) {
	draft.value = await ContactsAPI.get({
		itemId: id,
	});
}

function loadStaticContactGroupsList(params) {
	return ContactGroupsAPI.getLookup({
		...params,
		type: ContactsGroupType.Static,
	});
}

watch(
	() => props.shown,
	(value) => {
		if (value) {
			if (props.id) loadItem(props.id);
			else draft.value = generateNewDraft();
		}
	},
);
</script>

<style lang="scss" scoped>
.contact-popup-form {
  display: flex;
  flex-direction: column;
  grid-row-gap: var(--spacing-sm);

  :deep(.multiselect__content-wrapper) {
    max-height: 240px !important; // override default vue-multiselect styles, applied as attribute
  }
}
</style>
