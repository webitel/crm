<template>
  <section>
    <header class="content-header">
      <h3 class="content-title">
        {{ t('objects.generalInfo') }}
      </h3>
    </header>
    <div class="object-input-grid object-input-grid__1-col object-input-grid__w50">
      <wt-input
        :label="t('objects.name')"
        :value="itemInstance.name.length > 0 ? itemInstance.name : ''"
        @input="setItemProp({ prop: 'name', value: $event })"
        :v="itemInstance._dirty ? v$.itemInstance.name : false"
        required
      />
      <wt-select
        :value="itemInstance.type"
        :options="sourcesOptions"
        :clearable="false"
        :disabled="false"
        track-by="name"
        :label="t('lookups.sources.type.type')"
        @input="setItemProp({ prop: 'type', value: $event.type })"
      />
      <wt-textarea
        :label="t('objects.description')"
        :value="itemInstance.description"
        @input="setItemProp({ prop: 'description', value: $event })"
      />
    </div>
  </section>
</template>


<script setup>
 import { useVuelidate } from '@vuelidate/core';
 import { required } from '@vuelidate/validators';
 import {
    useDeleteConfirmationPopup,
  } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
 import { computed, onUnmounted, reactive, ref, watch } from 'vue';
 import { useI18n } from 'vue-i18n';
 import { useRoute, useRouter } from 'vue-router';
 import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';
 import { useStore } from 'vuex';

 const props = defineProps({
     fieldsData: {
       type: Object,
       required: true,
     },
 });

 const baseNamespace = 'sources';

 const router = useRouter();
 const route = useRoute();
 const { t } = useI18n();
 const store = useStore();

 const {
    isVisible: isDeleteConfirmationPopup,
    deleteCount,
    deleteCallback,

    askDeleteConfirmation,
    closeDelete,
 } = useDeleteConfirmationPopup();

 const {
    namespace,
    id,
    itemInstance,

    loadItem,
    setId,
    resetState,
    deleteItem,
 } = useCardStore(baseNamespace);

 const v$ = useVuelidate(computed(() => ({
     itemInstance: {
       name: { required },
     },
   })), { itemInstance }, { $autoDirty: true });

 const sourcesOptions = computed(() => [
   {
     name: t('lookups.sources.type.type'),
     type: 'TYPE',
   },
   {
     name: t('lookups.sources.type.call'),
     type: 'CALL',
   },
   {
     name: t('lookups.sources.type.chat'),
     type: 'CHAT',
   },
   {
     name: t('lookups.sources.type.socialMedia'),
     type: 'SOCIALMEDIA',
   },
   {
     name: t('lookups.sources.type.email'),
     type: 'EMAIL',
   },
   {
     name: t('lookups.sources.type.manual'),
     type: 'MANUAL',
   },
 ]);

 function setItemProp(payload) {
   console.log(payload);
   return store.dispatch(`${namespace}/SET_ITEM_PROPERTY`, payload);
 }

 onUnmounted(() => {
   resetState();
 });
</script>

<style lang="scss" scoped>
</style>
