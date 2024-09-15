<template>
  <wt-popup
    v-bind="$attrs"
    size="sm"
    min-width="480"
    @close="close"
  >
    <template #title>
      {{ title }}
    </template>
    <template #main>
      <section>
        <wt-table
          :data="dataList"
          :grid-actions="false"
          :headers="tableHeaders"
          :selectable="false"
        />
      </section>
    </template>
  </wt-popup>
</template>

<script>
export default {
  name: 'ObjectListPopup',
  props: {
    title: {
      type: String,
      default: '',
    },
    dataList: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      description: 'Or default "name" header',
    },
  },
  computed: {
    tableHeaders() {
      const defaultHeaders = [
        {
          value: 'name',
          text: this.$t('reusable.name'),
        },
      ];
      return this.headers || defaultHeaders;
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
