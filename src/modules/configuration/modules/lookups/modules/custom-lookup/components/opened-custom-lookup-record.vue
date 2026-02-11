<template>
  <wt-page-wrapper :actions-panel="!!currentTab.filters">
    <template #header>
      <wt-page-header
        :hide-primary="!hasSaveActionAccess"
        :primary-action="save"
        :primary-disabled="disabledSave"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-breadcrumb :path="path" />
      </wt-page-header>
    </template>

    <template #actions-panel>
      <component
        :is="currentTab.filters"
        :namespace="namespace"
      />
    </template>

    <template #main>
      <form
        class="main-container"
        @submit.prevent="save"
      >
        <wt-tabs
          :current="currentTab"
          :tabs="tabs"
          @change="changeTab"
        />
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :namespace="cardNamespace"
            :access="{
              read: true,
              edit: !disableUserInput,
              delete: !disableUserInput,
              add: !disableUserInput,
            }"
          />
        </router-view>
        <input
          hidden
          type="submit"
        />
        <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { WtObject } from '@webitel/ui-sdk/enums';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import CustomLookupsApi from '../../../../../../customization/modules/custom-lookups/api/custom-lookups.js';

const store = useStore();

const namespace = 'configuration/lookups/customLookup';
const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const {
	namespace: cardNamespace,
	id,
	itemInstance,
	setItemProp,
	...restStore
} = useCardStore(namespace);

const { isNew, pathName, saveText, save, initializeCard } = useCardComponent({
	...restStore,
	id,
	itemInstance,
});
const { hasSaveActionAccess, disableUserInput } = useUserAccessControl(
	WtObject.CustomLookup,
);

const close = () => {
	router.push({
		name: 'custom-lookup',
		params: {
			repo: repo.value,
		},
	});
};

// This case need to get validation from child fields
const v$ = useVuelidate(
	{},
	{
		itemInstance,
	},
	{
		$autoDirty: true,
	},
);

v$.value.$touch();

const disabledSave = computed(
	() => v$.value?.$invalid || !itemInstance.value._dirty,
);

const tabs = computed(() => {
	const general = {
		text: t('customization.customLookups.columns'),
		value: 'general',
		pathName: 'custom-lookup-record-columns',
	};

	return [
		general,
	];
});

const { currentTab, changeTab } = useCardTabs(tabs);

const path = computed(() => {
	return [
		{
			name: t('crm'),
			route: '/start-page',
		},
		{
			name: t('startPage.configuration.name'),
			route: '/configuration',
		},
		{
			name: t('lookups.lookups'),
			route: '/configuration',
		},
		{
			name: dictionary.value?.name,
			route: {
				name: 'custom-lookup',
				params: {
					repo: repo.value,
				},
			},
		},
		{
			name: isNew.value ? t('reusable.new') : pathName.value,
		},
	];
});

const dictionary = ref(null);
const repo = ref(route.params.repo);

const loadDictionary = async () => {
	try {
		dictionary.value = await CustomLookupsApi.get({
			itemId: repo.value,
		});

		store.commit(`${namespace}/card/SET`, {
			path: 'repo',
			value: repo.value,
		});
		store.commit(`${namespace}/card/SET`, {
			path: 'fields',
			value: dictionary.value.fields,
		});

		store.commit(`${namespace}/card/SET`, {
			path: 'fieldsToSend',
			value: dictionary.value.fields
				.filter((field) => !field.hidden && !field.default && !field.always)
				.map((field) => field.id),
		});

		store.commit(`${namespace}/card/SET`, {
			path: 'itemInstance',
			value: dictionary.value.fields.reduce((acc, field) => {
				if (field.hidden || field.default || field.always) {
					return acc;
				}

				acc[field.id] = null;
				return acc;
			}, {}),
		});
	} catch (e) {
		throw e;
	}
};

onMounted(async () => {
	await loadDictionary();

	await initializeCard();

	if (isNew.value) {
		store.getters[`${namespace}/card/LOOKUP_FIELDS`]?.forEach((field) => {
			if (field.required) {
				setItemProp({
					path: `${field.id}`,
					value: field.default,
				});
			}
		});
	}
});
</script>

<style lang="scss" scoped></style>
