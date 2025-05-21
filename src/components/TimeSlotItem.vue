<template>
  <div
    @click="$emit('select')"
    class="py-2 px-3 border rounded-md text-center cursor-pointer transition-colors"
    :class="isSelected ? 'bg-indigo-100 border-indigo-500 text-indigo-800' : 'border-gray-300 hover:bg-gray-50'"
  >
    {{ text }}
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select']);
</script> 