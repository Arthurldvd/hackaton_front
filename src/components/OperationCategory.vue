<template>
  <div class="border rounded-lg overflow-hidden">
    <div class="bg-gray-50 px-4 py-3 border-b">
      <h3 class="text-base font-medium text-gray-900">{{ title }}</h3>
    </div>
    <div class="p-4 space-y-3">
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