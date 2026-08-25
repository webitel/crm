<template>
  <wt-error-page
    type="403"
    @back="goToApplicationHub"
  />
</template>

<script setup>
function goToApplicationHub() {
	const adminUrl = import.meta.env.VITE_APPLICATION_HUB_URL;
	window.location.href = adminUrl;
}
</script>

<style lang="scss" scoped>

</style>
