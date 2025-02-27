<template>
  <section class="opened-custom-lookup-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div
      class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50"
    >
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        :v="v.itemInstance.name"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />
      <wt-input
        :label="t('customization.customLookups.code')"
        :value="itemInstance.repo"
        :v="v.itemInstance.repo"
        :disabled="!isNew"
        :custom-validators="[
          {
            name: 'checkRepo',
            text: $t('validation.latinWithNumber'),
          },
        ]"
        required
        @input="setItemProp({ path: 'repo', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :value="itemInstance.about"
        @input="setItemProp({ path: 'about', value: $event })"
      />

      <!--      TODO Hidden before backend will be ready for this-->
      <!--      <wt-switcher-->
      <!--        :label="t('customization.customLookups.controlPermissions')"-->
      <!--        :value="itemInstance.administered"-->
      <!--        @change="setItemProp({ path: 'administered', value: $event })"-->
      <!--      />-->
    </div>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
  v: {
    type: Object,
    required: true,
  },
  isNew: {
    type: Boolean,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);
</script>
