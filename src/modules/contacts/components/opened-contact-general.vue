<template>
  <article class="opened-contact-general wt-scrollbar">
    <wt-context-menu
      v-if="!isReadOnly"
      class="opened-contact-general-options"
      :options="actionOptions"
      @click="$event.option.handler()"
    >
      <template #activator="{ toggle }">
        <wt-icon-btn
          v-tooltip="t('vocabulary.options', 2)"
          icon="options"
          @click="toggle"
        />
      </template>

      <template #option="option">
        <div class="opened-contact-general-option">
          <wt-icon
            :icon="option.icon"
            :disabled="option.disabled"
          />

          {{ option.text }}
        </div>
      </template>
    </wt-context-menu>

    <wt-avatar
      size="3xl"
      :username="modelValue.name"
    />

    <div class="opened-contact-general-name typo-subtitle-1">
      <wt-icon
        v-if="modelValue.user"
        icon="webitel-logo"
      />

      {{ modelValue.name }}
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <p class="opened-contact-general-item__title typo-heading-4">
        {{ t('reusable.group') }}
      </p>

      <p class="opened-contact-general-item__value">
        {{ groupsList }}
      </p>
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <p class="opened-contact-general-item__title typo-heading-4">
        {{ t('date.timezone', 1) }}
      </p>
      <p
        v-if="modelValue.timezones?.length"
        class="opened-contact-general-item__value"
      >
        {{ modelValue.timezones[0].timezone?.name }}
      </p>
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <p class="opened-contact-general-item__title typo-heading-4">
        {{ t('contacts.manager', 1) }}
      </p>
      <p class="opened-contact-general-item__value">
        {{ modelValue.managers?.[0]?.user?.name }}
      </p>
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <p class="opened-contact-general-item__title typo-heading-4">
        {{ t('vocabulary.description') }}
      </p>
      <p class="opened-contact-general-item__value">
        {{ modelValue.about }}
      </p>
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <div class="opened-contact-general-item__value opened-contact-general-item__value--labels">
        <wt-chip
          v-for="{ label, id } of modelValue.labels"
          :key="id"
        >
          {{ label }}
        </wt-chip>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { ContactEntity } from '@webitel/api-services/api';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useContactEditAccessControl } from '../composables/useContactEditAccessControl';

const { access, isReadOnly } = useContactEditAccessControl();

const props = defineProps<{
	modelValue: ContactEntity;
}>();

const emit = defineEmits<{
	edit: [];
	delete: [];
}>();

const { t } = useI18n();

const actionOptions = computed(() => {
	const editAction = {
		text: t('reusable.edit'),
		icon: 'edit',
		handler: () => emit('edit'),
		disabled: !access?.value?.hasRbacEditAccess,
	};
	const deleteAction = {
		text: t('reusable.delete'),
		icon: 'bucket',
		handler: () => emit('delete'),
		disabled: !access?.value?.hasRbacDeleteAccess,
	};
	return [
		editAction,
		deleteAction,
	];
});

const groupsList = computed(
	() => props.modelValue.groups?.map((el) => el.name).join(', ') ?? '',
);
</script>

<style
  lang="scss"
  scoped
>
@use '@webitel/ui-sdk/src/css/main' as *;

.wt-avatar {
  flex-shrink: 0;
}

.opened-contact-general {
  display: flex;
  overflow: auto;
  align-items: center;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.opened-contact-general-options {
  align-self: flex-end;
}

.opened-contact-general-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.opened-contact-general-name {
  display: flex;
  align-items: center;
  grid-gap: var(--spacing-xs);
}

.opened-contact-general-item {
  align-self: flex-start;
}

.opened-contact-general-item__title {
  text-align: left;
}

.opened-contact-general-item__value--labels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}
</style>
