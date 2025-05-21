<template>
  <div :class="['flex justify-between text-sm', {'pt-2 mt-2 border-t border-gray-200 font-medium': isTotal}]">
    <dt>{{ label }}</dt>
    <dd>{{ value }}</dd>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  isTotal: {
    type: Boolean,
    default: false
  }
});
</script> 