<template>
  <wt-page-wrapper
    class="table-page"
    :actions-panel="false"
  >
    <template #main>
      <pre>
        {{ dictionary }}
      </pre>
    </template>
  </wt-page-wrapper>
</template>

<script setup>
// TODO That mock component for display page with repo params for future implementation of custom lookups
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import CustomLookupsApi from '../../../../../../customization/modules/custom-lookups/api/custom-lookups.js';

const route = useRoute();

const dictionary = ref(null);
const repo = ref(route.params.repo);

const loadDictionary = async () => {
  dictionary.value = await CustomLookupsApi.get({ itemId: repo.value });
  console.log('dictionary type', dictionary.value);
};

loadDictionary();
</script>
