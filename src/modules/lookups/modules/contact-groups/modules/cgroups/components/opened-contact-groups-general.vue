<template>
  <section>
    <header class="content-header">
      <h3 class="content-title">
        {{ $t('objects.generalInfo') }}
      </h3>
    </header>
    <div class="object-input-grid object-input-grid__1-col object-input-grid__w50">
      <wt-input
        :disabled="disableUserInput"
        :label="$t('objects.name')"
        :value="itemInstance.name"
        required
        @input="setItemProp({ prop: 'name', value: $event })"
      />
      <wt-textarea
        :disabled="disableUserInput"
        :label="$t('objects.description')"
        :value="itemInstance.description"
        @input="setItemProp({ prop: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script>
import openedTabComponentMixin from '../../../../../../../app/mixins/objectPagesMixins/openedObjectTabMixin/openedTabComponentMixin';

export default {
  name: 'OpenedAgentGeneral',
  mixins: [openedTabComponentMixin],
  methods: {
  },
};
</script>

<style lang="scss" scoped>
</style>
