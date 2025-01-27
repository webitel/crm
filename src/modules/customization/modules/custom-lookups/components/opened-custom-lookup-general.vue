<template>
  <section class="opened-custom-lookup-general">
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-custom-lookup-general__form">
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
        required
        @input="setItemProp({ path: 'repo', value: $event })"
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :value="itemInstance.description"
        @input="setItemProp({ path: 'description', value: $event })"
      />

      <wt-switcher
        :label="t('customization.customLookups.controlPermissions')"
        :value="itemInstance.controlPermission"
        @change="setItemProp({ path: 'controlPermission', value: $event })"
      />
    </div>
    <pre>
      {{ itemInstance }}
    </pre>
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
});

const { t } = useI18n();

const { itemInstance, setItemProp } = useCardStore(props.namespace);
</script>

<style lang="scss" scoped>
.opened-custom-lookup-general {
  &__form {
    max-width: max(650px, 60%);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}
</style>
