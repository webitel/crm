<template>
  <section>
    <header class="opened-card-header">
      <h3 class="opened-card-header__title">
        {{ t('reusable.generalInfo') }}
      </h3>
    </header>
    <div class="opened-card-input-grid opened-card-input-grid--1-col opened-card-input-grid--w50">
      <wt-input
        v-model="modelValue.name"
        :label="t('reusable.name')"
        :regle-validation="validationFields?.name"
        :disabled="disableUserInput"
        required
      />

      <wt-select
        v-model="modelValue.type"
        :label="t('vocabulary.type')"
        :options="typesSourcesOptions"
        :regle-validation="validationFields?.type"
        :disabled="disableUserInput"
        use-value-from-options-by-prop="id"
        required
      />

      <wt-textarea
        :label="t('vocabulary.description')"
        :disabled="disableUserInput"
        :value="modelValue.description"
        @input="modelValue.description = $event"
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import {RegleSchemaFieldStatus} from '@regle/schemas';
import {WebitelCasesSourceType} from '@webitel/api-services/gen/models';
import {WebitelCasesSource} from '@webitel/api-services/gen/models';
import {WtInput, WtSelect} from '@webitel/ui-sdk/components';
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';

import {useUserAccessControl} from '../../../../../../../app/composables/useUserAccessControl';

const modelValue = defineModel<WebitelCasesSource>();

defineProps<{
  validationFields: {
    /* keys as in CaseSource, but values are Regle schema objects */
    [K in keyof WebitelCasesSource]: RegleSchemaFieldStatus<WebitelCasesSource[K]>
  };
}>();

const {t} = useI18n();

const {disableUserInput} = useUserAccessControl();

const typesSourcesOptions = computed(() => Object.values(WebitelCasesSourceType)
  .filter((type) => type !== WebitelCasesSourceType.TypeUnspecified)
  .map((type) => {
    return {
      id: type,
      name: t(`lookups.sources.types.${type}`),
    };
  }));
</script>

<style lang="scss" scoped>
</style>
