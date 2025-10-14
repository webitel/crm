<template>
  <div>
    {{ value }}
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

import { CustomLookupField } from '../types/customLookupField';

defineProps<{
  value: CustomLookupField,
  isNew: boolean,
}>();
</script>
