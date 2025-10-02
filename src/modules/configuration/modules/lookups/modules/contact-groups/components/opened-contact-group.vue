<template>
  <wt-page-wrapper :actions-panel="!!currentTab.filters">
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="disabledSave"
        :primary-text="saveText"
        :hide-primary="!hasSaveActionAccess"
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
            :v="v$"
            :namespace="cardNamespace"
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
import { required, requiredIf } from '@vuelidate/validators';
import { ContactsGroupType } from '@webitel/api-services/gen/models';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';
import dynamicContactGroupsAPI from '../api/dynamicGroups.js';

const namespace = 'configuration/lookups/contactGroups';
const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const { hasSaveActionAccess } = useUserAccessControl();

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  addItem,
  updateItem,
  loadItem,
  setId,
  ...restStore
} = useCardStore(namespace);

const { isNew, pathName, saveText, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
  addItem,
  updateItem,
  loadItem,
  setId,
});

const { close } = useClose(CrmSections.CONTACT_GROUPS);

const isDynamicGroup = computed(
  () => itemInstance.value.type === ContactsGroupType.Dynamic,
);

const v$ = useVuelidate(
  computed(() => ({
    itemInstance: {
      name: { required },
      defaultGroup: { required: requiredIf(isDynamicGroup) },
    },
  })),
  { itemInstance },
  { $autoDirty: true },
);
v$.value.$touch();

const disabledSave = computed(
  () => v$.value?.$invalid || !itemInstance.value._dirty,
);

const tabs = computed(() => {
  const general = {
    text: t('reusable.general'),
    value: 'general',
    pathName: `${CrmSections.CONTACT_GROUPS}-general`,
  };

  const contacts = {
    text: t(`vocabulary.contact`, 2),
    value: 'contacts',
    pathName: `${CrmSections.CONTACT_GROUPS}-contacts`,
  };

  const conditions = {
    text: t('lookups.slas.conditions', 2),
    value: 'conditions',
    pathName: `${CrmSections.CONTACT_GROUPS}-conditions`,
  };

  const permissions = {
    text: t('vocabulary.permissions', 2),
    value: 'permissions',
    pathName: `${CrmSections.CONTACT_GROUPS}-permissions`,
  };

  const tabs = [general];

  if (id.value) {
    tabs.push(isDynamicGroup.value ? conditions : contacts);
    tabs.push(permissions);
  }

  return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);

const path = computed(() => {
  return [
    { name: t('crm'), route: '/start-page' },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    {
      name: t('lookups.contactGroups.contactGroups', 2),
      route: '/configuration/lookups/contact-groups',
    },
    { name: isNew.value ? t('reusable.new') : pathName.value },
  ];
});

const redirectToEdit = () => {
  return router.replace({
    ...route,
    params: { id: id?.value },
  });
};

const save = async () => {
  if (isNew.value) {
    if (isDynamicGroup.value) {
      const { id } = await dynamicContactGroupsAPI.add(itemInstance.value);
      await setId(id);
      await loadItem();
    } else {
      await addItem();
    }
  } else {
    if (isDynamicGroup.value) {
      await dynamicContactGroupsAPI.update({
        itemInstance: itemInstance.value,
        itemId: id.value,
      });
      await loadItem();
    } else {
      await updateItem();
    }
  }

  if (id?.value) {
    await redirectToEdit();
  }
};

initialize();
</script>
