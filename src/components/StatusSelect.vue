<template>
  <div class="w-full sm:w-auto">
    <div class="flex rounded-md shadow-sm">
      <span class="inline-flex items-center px-3 py-2 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
        {{ label }}
      </span>
      <select 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: 'Statut'
  },
  options: {
    type: Array,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script> 