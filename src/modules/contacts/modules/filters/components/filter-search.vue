<template>
  <form
    class="filter-search"
    @submit.prevent
  >
    <wt-search-bar
      :hint="searchBarHint"
      :v="v$.localValue"
      :value="localValue"
      debounce
      @search="setLocalValue($event)"
    >
      <template v-slot:additional-actions="options">
        <wt-context-menu
          :options="searchModeOptions"
          @click="changeMode($event.option)"
        >
          <template v-slot:activator>
            <wt-tooltip>
              <template v-slot:activator>
                <wt-icon-btn
                  :color="options.invalid ? 'error' : 'default'"
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
      </template>
    </wt-search-bar>
  </form>
</template>

<script setup>
import { useVuelidate } from '@vuelidate/core';
import getNamespacedState from '@webitel/ui-sdk/src/store/helpers/getNamespacedState';
import {
  watch,
  computed,
  ref,
  onMounted,
} from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'vuex';
import variableSearchValidator from '@webitel/ui-sdk/src/validators/variableSearchValidator/variableSearchValidator';
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
  {
    value: SearchMode.VARIABLES,
    text: t('contacts.attributes', 1),
  },
  {
    value: SearchMode.DESTINATION,
    text: t('contacts.destination'),
  },
]);

const filterQuery = ref(SearchMode.NAME);
const filterSchema = computed(() => (
  getNamespacedState(store.state, `${props.namespace}`)[filterQuery.value]));

const searchBarHint = computed(() => {
  switch (filterQuery.value) {
    case SearchMode.VARIABLES:
      return t('webitelUI.searchBar.variableSearchHint');
    default:
      return null;
  }
});

const v$ = useVuelidate(computed(() => {
  return {
    localValue: filterQuery.value === SearchMode.VARIABLES ? { variableSearchValidator } : {},
  };
}), { localValue }, { $autoDirty: true });

v$.value.$touch();

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
</style>
