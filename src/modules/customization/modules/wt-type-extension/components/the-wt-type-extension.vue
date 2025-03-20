<template>
  <wt-page-wrapper :actions-panel="false">
    <template #header>
      <wt-page-header
        :primary-action="saveExtension"
        :primary-disabled="disabledSave"
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
        <opened-custom-lookup-columns
          :is-new="isNew"
          :v="v$"
          :title="$t(`customization.extensions.${repo}`)"
          :namespace="cardNamespace"
        />
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import OpenedCustomLookupColumns from '../../custom-lookups/components/opened-custom-lookup-columns.vue';

const namespace = 'customization/wtTypeExtension';

const { t } = useI18n();
const route = useRoute();

const repo = computed(() => route.params.id);

const {
  namespace: cardNamespace,
  id,
  itemInstance,
  ...restStore
} = useCardStore(namespace);

const { isNew, saveText, save, initialize } = useCardComponent({
  ...restStore,
  id,
  itemInstance,
});

const { close } = useClose('customization');

// This case need to get validation from child fields
const v$ = useVuelidate({}, { itemInstance }, { $autoDirty: true });

v$.value.$touch();

const disabledSave = computed(
  () => v$.value?.$invalid || !itemInstance.value?._dirty,
);

const path = computed(() => {
  return [
    { name: t('crm'), route: '/start-page' },
    {
      name: t('customization.customization'),
      route: '/customization',
    },
    {
      name: repo.value && t(`customization.extensions.${repo.value}`),
    },
  ];
});

initialize();

const saveExtension = async () => {
  try {
    await save();
  } catch (error) {
    console.log('error', error);
  }
};
</script>

<style lang="scss" scoped></style>
