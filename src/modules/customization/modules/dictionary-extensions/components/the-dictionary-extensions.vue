<template>
  <wt-page-wrapper>
    <template #header>
      <wt-page-header
        :primary-action="save"
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
        <div>
          <!--          TODO implement columns for ectensions dictionary-->
        </div>
      </form>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import { useCardComponent } from '@webitel/ui-sdk/src/composables/useCard/useCardComponent.js';
import { useCardStore } from '@webitel/ui-sdk/src/store/new/index.js';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();

const namespace = 'customization/dictionaryExtensions';
const { t } = useI18n();

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

const close = () => {
  router.push({
    name: 'customization',
  });
};

// This case need to get validation from child fields
const v$ = useVuelidate({}, { itemInstance }, { $autoDirty: true });

v$.value.$touch();

const disabledSave = computed(
  () => v$.value?.$invalid || !itemInstance.value._dirty,
);

const path = computed(() => {
  return [
    { name: t('crm') },
    {
      name: t('customization.customization'),
      route: '/customization',
    },
    {
      name:
        itemInstance.value.repo &&
        t(`customization.extensions.${itemInstance.value.repo}`),
    },
  ];
});

initialize();
</script>

<style lang="scss" scoped></style>
