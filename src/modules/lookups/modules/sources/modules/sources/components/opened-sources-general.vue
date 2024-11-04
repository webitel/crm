<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
<!--        //переклади будуть в наступних комітах-->
        {{ t('objects.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50">
<!--      //переклади будуть в наступних комітах-->
      <wt-input
        :label="t('objects.name')"
        :value="itemInstance.name.length > 0 ? itemInstance.name : ''"
        :v="itemInstance._dirty ? v$.itemInstance.name : false"
        required
        @input="setItemProp({ prop: 'name', value: $event })"
      />
      <wt-select
        :label="t('lookups.sources.type.type')"
        :value="itemInstance.type"
        :options="sourcesOptions"
        :clearable="false"
        :disabled="false"
        track-by="name"
        @input="setItemProp({ prop: 'type', value: $event.type })"
      />
<!--      //переклади будуть в наступних комітах-->
      <wt-textarea
        :label="t('objects.description')"
        :value="itemInstance.description"
        @input="setItemProp({ prop: 'description', value: $event })"
      />
    </div>
  </section>
</template>

<script setup>
 import { useCardStore } from '@webitel/ui-sdk/src/modules/CardStoreModule/composables/useCardStore';
 import { useDeleteConfirmationPopup } from '@webitel/ui-sdk/src/modules/DeleteConfirmationPopup/composables/useDeleteConfirmationPopup';
 import { computed, onUnmounted } from 'vue';
 import { useI18n } from 'vue-i18n';
 import { useVuelidate } from '@vuelidate/core';
 import { required } from '@vuelidate/validators';
 import { useRoute, useRouter } from 'vue-router';
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
    resetState,
 } = useCardStore(baseNamespace);

 const v$ = useVuelidate(computed(() => ({
     itemInstance: {
       name: { required },
     },
   })), { itemInstance }, { $autoDirty: true });

 const sourcesOptions = computed(() => [
   //переклади будуть в наступних комітах
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
   return store.dispatch(`${namespace}/SET_ITEM_PROPERTY`, payload);
 }

 onUnmounted(() => {
   resetState();
 });
</script>
