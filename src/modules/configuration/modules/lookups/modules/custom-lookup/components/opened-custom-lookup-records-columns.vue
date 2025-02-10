<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid">
      {{ itemInstance }}

      <pre>{{ fields }}</pre>
    </div>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();

const { t } = useI18n();

const fields = computed(
  () => store.getters[`${props.namespace}/LOOKUP_FIELDS`],
);
const { itemInstance, setItemProp } = useCardStore(props.namespace);
</script>
