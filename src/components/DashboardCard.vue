<template>
  <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <div :class="['px-6 py-5 border-b border-gray-200', colorClass]">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold" :class="titleColorClass">{{ title }}</h2>
        <slot name="badge"></slot>
      </div>
    </div>
    <div class="p-6">
      <slot></slot>
      <div class="mt-4">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'gray',
    validator: (value) => ['indigo', 'green', 'gray'].includes(value)
  }
});

const colorClass = computed(() => {
  const colorMap = {
    indigo: 'bg-indigo-50',
    green: 'bg-green-50',
    gray: 'bg-gray-50'
  };
  return colorMap[props.color] || 'bg-gray-50';
});

const titleColorClass = computed(() => {
  const colorMap = {
    indigo: 'text-indigo-800',
    green: 'text-green-800',
    gray: 'text-gray-800'
  };
  return colorMap[props.color] || 'text-gray-800';
});
</script> 