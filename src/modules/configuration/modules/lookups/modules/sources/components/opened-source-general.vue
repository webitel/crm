<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50">
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-select
        :label="t('vocabulary.type')"
        :options="typesSourcesOptions"
        :value="currentTypeSource"
        required
        @input="setItemProp({ path: 'type', value: $event.id })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useI18n } from 'vue-i18n';
import TypesSources from '../enums/TypesSources.enum.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);

const typesSourcesOptions = computed(() => Object.values(TypesSources).map((type) => {
  return {
    id: type,
    name: t(`lookups.sources.types.${type}`),
  };
}));

const currentTypeSource = computed(() => {
  return typesSourcesOptions.value.find((type) => type.id === itemInstance.value?.type);
});
</script>

<style lang="scss" scoped>
</style>
