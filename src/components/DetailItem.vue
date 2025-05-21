<template>
  <div :class="['px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6', alternate ? 'bg-gray-50' : 'bg-white']">
    <dt class="text-sm font-medium text-gray-500">{{ label }}</dt>
    <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      <slot></slot>
    </dd>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  alternate: {
    type: Boolean,
    default: false
  }
});
</script> 