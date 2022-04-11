<script setup lang="ts">
import BaseSpinner from '@/components/BaseSpinner.vue';
</script>

<template>
  <suspense :timeout="0">
    <template #default>
      <slot name="default" />
    </template>
    <template #fallback>
      <slot name="fallback">
        <BaseSpinner />
      </slot>
    </template>
  </suspense>
</template>
