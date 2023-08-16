<template>
  <article class="opened-contact-general">
    <wt-context-menu
      class="opened-contact-general-options"
      :options="actionOptions"
      @click="$event.option.handler()"
    >
      <template v-slot:activator>
        <wt-tooltip>
          <template v-slot:activator>
            <wt-icon-btn
              icon="options"
            ></wt-icon-btn>
          </template>
          {{ t('vocabulary.options', 2) }}
        </wt-tooltip>
      </template>
      <template v-slot:option="option">
        <div class="opened-contact-general-option">
          <wt-icon
            :icon="option.icon"
            :disabled="option.disabled"
          ></wt-icon>

          {{ option.text }}
        </div>
      </template>
    </wt-context-menu>

    <wt-avatar
      size="3xl"
    ></wt-avatar>

    <p class="opened-contact-general-name">{{ commonName }}</p>

    <wt-divider></wt-divider>

    <div class="opened-contact-general-item" v-if="timezones.length">
      <p class="opened-contact-general-item__title">
        {{ t('date.timezone', 1) }}
      </p>
      <p class="opened-contact-general-item__value">{{ timezones[0] }}</p>
    </div>

    <wt-divider v-if="timezones.length"></wt-divider>

    <div class="opened-contact-general-item" v-if="managers.length">
      <p class="opened-contact-general-item__title">
        {{ t('contacts.manager', 1) }}
      </p>
      <p class="opened-contact-general-item__value">{{ managers[0] }}</p>
    </div>

    <wt-divider v-if="managers.length"></wt-divider>

    <div class="opened-contact-general-item" v-if="about">
      <p class="opened-contact-general-item__title">
        {{ t('vocabulary.description') }}
      </p>
      <p class="opened-contact-general-item__value">{{ about }}</p>
    </div>

    <wt-divider v-if="about"></wt-divider>

    <div class="opened-contact-general-item" v-if="labels.length">
      <div class="opened-contact-general-item__value opened-contact-general-item__value--labels">
        <wt-chip
          v-for="({ label, id }) of labels"
          :key="id"
        >{{ label }}
        </wt-chip>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, inject, toRefs } from 'vue';
import { useI18n } from 'vue-i18n';

const access = inject('access');

const props = defineProps({
  commonName: {
    type: String,
    required: true,
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
});

const emit = defineEmits([
  'edit',
  'delete',
]);

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
  return [
    editAction,
    deleteAction,
  ];
});
</script>

<style lang="scss" scoped>
.opened-contact-general {
  @extend %wt-scrollbar;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  overflow: auto;
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
  @extend %typo-subtitle-1;
}

.opened-contact-general-item {
  align-self: flex-start;
}

.opened-contact-general-item__title {
  text-align: left;
  @extend %typo-subtitle-1;
}

.opened-contact-general-item__value--labels {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}
</style>
