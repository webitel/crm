<template>
  <wt-popup
    :shown="shown"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ props.id ? t('reusable.edit') : t('reusable.add') }}
      {{ t('lookups.conditions', 1).toLowerCase() }}
    </template>
    <template #main>
      <form>
        <wt-input
          :value="itemInstance.name"
          :label="t('reusable.name')"
          :v="v$.itemInstance.name"
          required
          @input="setItemProp({ path: 'name', value: $event })"
        />
        <wt-select
          :value="itemInstance.priorities"
          :label="t('vocabulary.priority')"
          :search-method="PrioritiesAPI.getLookup"
          @input="setItemProp({ path: 'name', value: $event })"
        />
        <wt-timepicker
          :disabled="disableUserInput"
          :label="t('lookups.slas.reactionTime')"
          :v="v.itemInstance.reactionTime"
          :value="itemInstance.reactionTime"
          format="hh:mm"
          @input="setItemProp({ prop: 'reactionTime', value: +$event })"
        />

        <wt-timepicker
          :disabled="disableUserInput"
          :label="t('lookups.slas.resolutionTime')"
          :v="v.itemInstance.resolutionTime"
          :value="itemInstance.resolutionTime"
          format="hh:mm"
          @input="setItemProp({ prop: 'resolutionTime', value: +$event })"
        />
      </form>
    </template>
    <template #actions>
      <wt-button @click="saveCondition">
        {{ t('objects.save') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('objects.cancel') }}
      </wt-button>
    </template>
  </wt-popup>


</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/store';
import PrioritiesAPI from '../../../../ priorities/api/priorities.js';
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();
const route = useRoute();
const router = useRouter();
const { t } = useI18n();

const {
  namespace: cardNamespace,
  itemInstance,
  resetState,
  setItemProp,
} = useCardStore(props.namespace);

const shown = computed(() => !!route.params.tokenId);

const userName = computed(() => store.state.directory.users.itemInstance.name);

const saveCondition = () => store.dispatch(`${cardNamespace}/ADD_TOKEN`);

const close = () => {
  const params = { ...route.params };
  delete params.tokenId;

  return router.push({
    ...route,
    params,
  });
};

watch(shown, (value) => {
  if (!value) resetState();
});
</script>

<style lang="scss" scoped>
</style>
