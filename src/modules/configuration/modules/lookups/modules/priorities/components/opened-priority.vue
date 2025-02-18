<template>
  <wt-page-wrapper
    :actions-panel="false"
  >
    <template #header>
      <wt-page-header
        :primary-action="save"
        :primary-disabled="!hasSaveActionAccess || disabledSave"
        :primary-text="saveText"
        :secondary-action="close"
      >
        <wt-headline-nav :path="path" />
      </wt-page-header>
    </template>

    <template #main>
      <form
        class="main-container"
        @submit.prevent="save"
      >
        <router-view v-slot="{ Component }">
          <component
            :is="Component"
            :v="v$"
            :namespace="cardNamespace"
            :access="/*is used by permissions tab*/{ read: true, edit: !disableUserInput, delete: !disableUserInput, add: !disableUserInput }"
          />
        </router-view>
        <input
          hidden
          type="submit"
        > <!--  submit form on Enter  -->
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import CrmSections from '@webitel/ui-sdk/src/enums/WebitelApplications/CrmSections.enum.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useUserAccessControl } from '../../../../../../../app/composables/useUserAccessControl';

const namespace = 'configuration/lookups/priorities';
const { t } = useI18n();
const route = useRoute();

const { hasSaveActionAccess, disableUserInput } = useUserAccessControl();

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  ...restStore
} = useCardStore(namespace);

const { isNew, pathName, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});

const { close } = useClose(CrmSections.PRIORITIES);

const v$ = useVuelidate(computed(() => ({
  itemInstance: {
    name: { required },
    color: { required },
  },
})), { itemInstance }, { $autoDirty: true });
v$.value.$touch();
const disabledSave = computed(() => v$.value?.$invalid || !itemInstance.value._dirty);

const path = computed(() => {

  return [
    { name: t('crm') },
    { name: t('startPage.configuration.name'), route: '/configuration' },
    { name: t('lookups.lookups'), route: '/configuration' },
    { name: t('vocabulary.priority', 2), route: '/lookups/priorities' },
    {
      name: isNew.value ? t('reusable.new') : pathName.value,
    },
  ];
});

initialize();
</script>

<style lang="scss" scoped>
</style>
