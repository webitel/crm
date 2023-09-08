<template>
  <form
    class="filter-search"
    @submit.prevent>
    <wt-search-bar
      :value="localValue"
      debounce
      @search="setLocalValue($event)"
    >
    </wt-search-bar>
    <wt-context-menu
      :options="searchModeOptions"
      @click="changeMode($event.option)"
    >
      <template v-slot:activator>
        <wt-tooltip>
          <template v-slot:activator>
            <wt-icon-btn
              v-if="!localValue"
              icon="filter"
            ></wt-icon-btn>
          </template>
          {{ $t('webitelUI.searchBar.settingsHint') }}
        </wt-tooltip>
      </template>
      <template v-slot:option="{ value, text }">
        <wt-radio
          :label="text"
          :selected="filterQuery === value"
          :value="true"
        ></wt-radio>
      </template>
    </wt-context-menu>
  </form>
</template>

<script setup>
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import {
  watch,
  computed,
  ref,
  onMounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import SearchMode from '../enums/SearchMode.enum';

const props = defineProps({
  namespace: {
    type: String,
    required: true,
  },
});

const store = useStore();
const { t } = useI18n();

const localValue = ref('');

const searchModeOptions = computed(() => [
  {
    value: SearchMode.NAME,
    text: t('reusable.name'),
  },
  {
    value: SearchMode.LABELS,
    text: t('vocabulary.labels', 1),
  },
  {
    value: SearchMode.ABOUT,
    text: t('vocabulary.description'),
  },
]);

const filterQuery = ref(SearchMode.NAME);
const filterSchema = computed(() => (
  getNamespacedState(store.state, `${props.namespace}`)[filterQuery.value]));

function getValue(filter) {
  return store.getters[`${props.namespace}/GET_FILTER`](filter);
}

function setValue(payload) {
  return store.dispatch(`${props.namespace}/SET_FILTER`, payload);
}

function changeMode({ value }) {
  setValue({ filter: filterQuery.value, value: '' });
  filterQuery.value = value;
}

function setLocalValue(value) {
  localValue.value = value;
  setValue({ filter: filterQuery.value, value: localValue.value });
}

function restoreSearchMode() {
  // we need to wait until filters will restore so that we know what filter mode is set
  setTimeout(() => {
    const mode = searchModeOptions.value.find(({ value }) => !!getValue(value));
    if (mode) changeMode({ value: mode.value });
  }, 1000);
}

watch(() => filterSchema.value.value, () => {
  localValue.value = filterSchema.value.value;
}, { immediate: true });

onMounted(() => restoreSearchMode());
</script>

<style lang="scss" scoped>
.filter-search {
  position: relative;
  z-index: 2;

  .wt-context-menu {
    position: absolute;
    top: 50%;
    right: var(--spacing-xs);
    transform: translateY(-50%);
  }
}
</style>
