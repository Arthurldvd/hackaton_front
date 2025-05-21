<template>
  <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">{{ title }}</h3>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      <slot></slot>
    </div>
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