<template>
  <div class="mt-6 bg-gray-50 p-4 rounded-md">
    <h4 class="text-sm font-medium text-gray-900">{{ title }}</h4>
    <dl class="mt-2 space-y-2">
      <slot></slot>
    </dl>
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