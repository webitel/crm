<template>
  <wt-button
    :color="color"
    :variant="ButtonVariant.OUTLINED"
    :icon="icon"
    class="timeline-rounded-action"
    rounded
    @click="emit('click')"
  />
</template>

<script setup lang="ts">
import { ButtonColor, ButtonVariant } from '@webitel/ui-sdk/enums';

interface Props {
	icon: string;
	color?: ButtonColor;
}

withDefaults(defineProps<Props>(), {
	color: ButtonColor.SECONDARY,
});

const emit = defineEmits<{
	click: [];
}>();
</script>
