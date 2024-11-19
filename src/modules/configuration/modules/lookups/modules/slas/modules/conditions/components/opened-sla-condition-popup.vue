<template>
  <wt-popup
    :shown="!!conditionId"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ conditionId !== 'new' ? t('reusable.edit') : t('reusable.add') }}
      {{ t('lookups.slas.conditions', 1).toLowerCase() }}
    </template>
    <template #main>
      <form>
        <wt-input
          :value="itemInstance.name"
          :label="t('reusable.name')"
          :v="v.itemInstance.name"
          required
          @input="setItemProp({ path: 'name', value: $event })"
        />
        <wt-select
          :value="itemInstance.priorities"
          :label="t('vocabulary.priority')"
          multiple
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
      <wt-button @click="save">
        {{ t('reusable.save') }}
      </wt-button>
      <wt-button
        color="secondary"
        @click="close"
      >
        {{ t('reusable.cancel') }}
      </wt-button>
    </template>
  </wt-popup>


</template>

<script setup>
import { required } from '@vuelidate/validators';
import { useClose } from '@webitel/ui-sdk/src/composables/useClose/useClose.js';
import { useCardStore } from '@webitel/ui-sdk/store';
import PrioritiesAPI from '../../../../ priorities/api/priorities.js';
import { computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useValidate } from '@webitel/ui-sdk/src/composables/useValidate/useValidate.js';

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
  addItem,
  loadItem,
  updateItem,
  setId,
  setItemProp,
} = useCardStore(props.namespace);

const getDefaultDraft = () => ({
  id: '',
  name: '',
  reactionTime: '',
  resolutionTime: '',
  priorities: [],
});

const conditionId = computed(() => route.params.conditionId);
console.log(conditionId.value);

const validateSchema = computed(() => ({
  itemInstance: {
    name: {
      required,
    },
    reactionTime: {
      required,
    },
    resolutionTime: {
      required,
    },
  },
}));

const { v$: v, invalid } = useValidate(validateSchema, { itemInstance });

async function initializePopup() {
  try {
    if (conditionId.value !== 'new') {
      // isLoading.value = true;
      console.log(conditionId.value);
      await setId(conditionId.value);
      await loadItem();
    } else {
      await addItem(getDefaultDraft());
    }
  } finally {
    // isLoading.value = false;
  }
}

function close() {
  router.go(-1);
}

onMounted(() =>  initializePopup());

watch(() => conditionId.value, (value) => {
  if(value) {
    loadItem(value) /////не закінчила
  }
});


</script>

<style lang="scss" scoped>
</style>
