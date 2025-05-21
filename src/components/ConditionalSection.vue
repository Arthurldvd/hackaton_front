<template>
  <div class="space-y-4 pt-2 border-t border-gray-200 mt-4">
    <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  }
});
</script> 