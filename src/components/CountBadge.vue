<template>
  <span :class="[`bg-${color}-100 text-white py-1 px-3 rounded-full text-sm font-medium`]">
    {{ count }}
  </span>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    default: 'gray',
    validator: (value) => ['indigo', 'green', 'gray', 'red', 'yellow', 'blue'].includes(value)
  }
});
</script> 