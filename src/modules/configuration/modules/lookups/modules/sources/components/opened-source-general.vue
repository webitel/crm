<template>
  <section class="opened-sla-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      <wt-input
        :label="t('reusable.name')"
        :value="itemInstance.name"
        required
        @input="setItemProp({ path: 'name', value: $event })"
      />

      <wt-select
        :label="t('vocabulary.type')"
        :options="TypesSourcesOptions"
        :value="currentType"
        required
        @input="setItemProp({ prop: 'type', value: $event.id })"
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

const TypesSourcesOptions = Object.values(TypesSources).map((type) => {
  return {
    id: type,
    name: t(`lookups.sources.type.${type}`),
  };
});

const currentType = computed(() => {
  return TypesSourcesOptions.find((type) => type.id === itemInstance.value?.type);
});
</script>

<style lang="scss" scoped>
.opened-sla-general__wrapper {
  display: flex;
  gap: var(--spacing-sm);
}
</style>
