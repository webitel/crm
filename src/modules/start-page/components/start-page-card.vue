<template>
  <article class="start-page-card">
    <header class="start-page-card__header">
      <wt-icon v-if="card.disabled" icon="lock"/>
      {{ card.name }}
    </header>
    <section class="start-page-card__main-section">
      <img :src="card.image" :alt="card.name">
      <p class="start-page-card__description">
        {{ card.text }}
      </p>
    </section>
    <footer>
      <wt-button
          :disabled="card.disabled"
          wide
          color="secondary"
          @click="open"
          class="start-page-card__button"
      >
        {{ $t('reusable.open') }}
      </wt-button>
    </footer>
  </article>
</template>

<script>

export default {
  name: 'start-page-card',
  props: {
    card: {
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
.start-page-card {
  box-sizing: border-box;
  width: 264px;
  padding: var(--spacing-xs);
  color: var(--text-main-color);
  border-radius: var(--border-radius);
  background-color: var(--content-wrapper-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  &__header {
    @extend %typo-heading-4;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  &__description {
    @extend %typo-body-1;
    height: 78px;
    //in order to cut text after 3rd line:
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
  &__button.wt-button.secondary{
    &:hover{
      background-color: var(--btn-primary-color);
    }
  }
}

</style>
