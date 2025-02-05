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
        <wt-headline-nav :path="path" />
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
            :is-new="isNew"
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
import { helpers, required } from '@vuelidate/validators';
import { useAccessControl } from '@webitel/ui-sdk/src/composables/useAccessControl/useAccessControl.js';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardTabs } from '@webitel/ui-sdk/src/composables/useCard/useCardTabs.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useTableEmpty } from '@webitel/ui-sdk/src/modules/TableComponentModule/composables/useTableEmpty.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const namespace = 'customization/customLookups';
const { t } = useI18n();

const checkRepo = (repo) => {
  const regex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
  return regex.test(repo);
};

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  ...restStore
} = useCardStore(namespace);

const v$ = useVuelidate(
  computed(() => ({
    itemInstance: {
      name: { required },
      repo: {
        checkRepo: helpers.withMessage(
          t('validation.latinWithNumber'),
          checkRepo,
        ),
      },
    },
  })),
  { itemInstance },
  { $autoDirty: true },
);

v$.value.$touch();

const { isNew, pathName, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});
const { hasSaveActionAccess, disableUserInput } = useAccessControl();

const { close } = useClose(CrmSections.CUSTOM_LOOKUPS);
const disabledSave = computed(
  () => v$.value?.$invalid || !itemInstance.value._dirty,
);

const tabs = computed(() => {
  const general = {
    text: t('reusable.general'),
    value: 'general',
    pathName: `${CrmSections.CUSTOM_LOOKUPS}-general`,
  };
  const columns = {
    text: t('customization.customLookups.columns', 2),
    value: 'columns',
    pathName: `${CrmSections.CUSTOM_LOOKUPS}-columns`,
  };

  const tabs = [general];

  if (id.value) tabs.push(columns);
  return tabs;
});

const { currentTab, changeTab } = useCardTabs(tabs);

const path = computed(() => {
  return [
    { name: t('crm'), route: '/start-page' },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('customization.customization'), route: '/customization' },
    {
      name: t('customization.customLookups.customLookups'),
      route: {
        name: CrmSections.CUSTOM_LOOKUPS,
      },
    },
    {
      name: isNew.value ? t('reusable.new') : pathName.value,
    },
  ];
});

initialize();
</script>

<style lang="scss" scoped></style>
