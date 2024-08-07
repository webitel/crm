<template>
  <div class="start-page-logo">
    <img :src="image.src" :alt="image.name">
  </div>
</template>

<script>
  export default {
    name: 'start-page-card',
    props: {
      image: {
        type: Object,
        required: true,
      },
    },
    methods: {
      open() {
        this.$router.push(this.card.route);
      },
    },
  };
</script>

<style lang="scss" scoped>
  .start-page-logo{
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
