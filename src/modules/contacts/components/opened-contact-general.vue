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
      :username="name"
    />

    <div class="opened-contact-general-name typo-subtitle-1">
      <wt-icon
        v-if="user"
        icon="webitel-logo"
      />

      {{ name }}
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <p class="opened-contact-general-item__title typo-subtitle-1">
        {{ t('reusable.group') }}
      </p>

      <p class="opened-contact-general-item__value">
        {{ groupsList }}
      </p>
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <p class="opened-contact-general-item__title">
        {{ t('date.timezone', 1) }}
      </p>
      <p
        v-if="timezones.length"
        class="opened-contact-general-item__value"
      >
        {{ timezones[0].timezone.name }}
      </p>
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <p class="opened-contact-general-item__title">
        {{ t('contacts.manager', 1) }}
      </p>
      <p class="opened-contact-general-item__value">
        {{ managers[0]?.user.name }}
      </p>
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <p class="opened-contact-general-item__title">
        {{ t('vocabulary.description') }}
      </p>
      <p class="opened-contact-general-item__value">
        {{ about }}
      </p>
    </div>

    <wt-divider />

    <div class="opened-contact-general-item">
      <div class="opened-contact-general-item__value opened-contact-general-item__value--labels">
        <wt-chip
          v-for="{ label, id } of labels"
          :key="id"
        >
          {{ label }}
        </wt-chip>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';

const access = inject('access');
const isReadOnly = inject('isReadOnly');

const props = defineProps({
  name: {
    type: String,
    default: '',
  },
  timezones: {
    type: Array,
    default: () => [],
  },
  managers: {
    type: Array,
    default: () => [],
  },
  about: {
    type: String,
    default: '',
  },
  labels: {
    type: Array,
    default: () => [],
  },
  groups: {
    type: Array,
    default: () => [],
  },
  user: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['edit', 'delete']);

const { t } = useI18n();

const actionOptions = computed(() => {
  const editAction = {
    text: t('reusable.edit'),
    icon: 'edit',
    handler: () => emit('edit'),
    disabled: !access.value.hasRbacEditAccess,
  };
  const deleteAction = {
    text: t('reusable.delete'),
    icon: 'bucket',
    handler: () => emit('delete'),
    disabled: !access.value.hasRbacDeleteAccess,
  };
  return [editAction, deleteAction];
});

const groupsList = computed(() => props.groups.map((el) => el.name).join(', '));
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

  .opened-contact-general-option {
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
  }
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
