<template>
  <section>
    <header class="content-header">
      <h3 class="content-title">{{ $t('objects.ccenter.queues.variables') }}</h3>
      <wt-icon-action
        action="add"
        @click="addVariable"
      ></wt-icon-action>
    </header>
    <form class="object-input-grid">
      <div class="variables">
        <div
          v-for="(variable, key) in itemInstance.variables"
          :key="key"
          class="value-pair"
        >
          <wt-input
            :placeholder="$t('objects.ccenter.queues.varKey')"
            :value="variable.key"
            @input="setItemProp({index: key, prop: 'key', value: $event})"
          ></wt-input>
          <wt-input
            :placeholder="$t('objects.ccenter.queues.varVal')"
            :value="variable.value"
            @input="setItemProp({index: key, prop: 'value', value: $event})"
          ></wt-input>
          <wt-icon-action
            action="delete"
            class="table-action"
            @click="deleteVariable(key)"
          ></wt-icon-action>
        </div>
      </div>
    </form>
  </section>
</template>

<script setup>
import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';

const namespace = 'contacts';

const {
  itemInstance,

  setItemProp,
} = useCardStore(namespace);
</script>

<style lang="scss" scoped>
</style>
