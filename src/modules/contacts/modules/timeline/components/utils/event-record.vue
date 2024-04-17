<template>
  <div class="event-record">
    <section>
      <slot name="date"></slot>
    </section>

    <section>
      <slot name="collapse"></slot>
    </section>

    <section>
      <slot name="content"></slot>
    </section>
  </div>
</template>
<style  lang="scss" scoped>
.event-record {
  display: grid;

  grid-template-columns: 2fr 1fr 10fr;
  grid-template-rows: 1fr;
}
</style>
