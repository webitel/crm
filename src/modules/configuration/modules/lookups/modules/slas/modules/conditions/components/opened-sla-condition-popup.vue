<template>
  <wt-popup
    :shown="!!conditionId"
    size="sm"
    @close="close"
  >
    <template #title>
      {{ !isNew ? t('reusable.edit') : t('reusable.add') }}
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
          :search-method="PrioritiesAPI.getLookup"
          multiple
          @input="setItemProp({ path: 'priorities', value: $event })"
        />
        <wt-timepicker
          :label="t('lookups.slas.reactionTime')"
          :v="v.itemInstance.reactionTime"
          :value="itemInstance.reactionTime"
          format="hh:mm"
          @input="setItemProp({ prop: 'reactionTime', value: $event })"
        />

        <wt-timepicker
          :label="t('lookups.slas.resolutionTime')"
          :v="v.itemInstance.resolutionTime"
          :value="itemInstance.resolutionTime"
          format="hh:mm"
          @input="setItemProp({ prop: 'resolutionTime', value: $event })"
        />
      </form>
    </template>
    <template #actions>
      <wt-button
        :disabled="v.$invalid"
        @click="save">
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
import { computed, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { required } from '@vuelidate/validators';
import { useRoute, useRouter } from 'vue-router';
import { useCardStore } from '@webitel/ui-sdk/store';
import { useValidate } from '@webitel/ui-sdk/src/composables/useValidate/useValidate.js';
import PrioritiesAPI from '../../../../ priorities/api/priorities.js';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['load-data']);

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
  id,
} = useCardStore(props.namespace);

const conditionId = computed(() => route.params.conditionId);
const isNew = computed(() => conditionId.value === 'new');

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

const { v$: v } = useValidate(validateSchema, { itemInstance });
v.value?.$touch();

function close() {
  router.go(-1);
}

function loadDataList() {
  emit('load-data');
}

const save = async () => {
  if (isNew.value) {
    await addItem({ itemInstance, parentId: id.value });
  } else {
    await updateItem({ itemInstance, itemId: id.value });
  }

  if (id?.value) {
    close();
    loadDataList();
  }
};

async function initializePopup() {
  try {
    if (!isNew.value) {
      await setId(conditionId.value);
      await loadItem();
    }
  } catch (error) {
    console.error(error);
  }
}

watch(() => conditionId.value, (value) => {
  if(value) {
    initializePopup();
  } else {
    resetState();
  }
}, { immediate: true });
</script>

<style lang="scss" scoped>
</style>
