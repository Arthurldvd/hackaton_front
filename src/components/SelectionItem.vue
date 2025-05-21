<template>
  <div 
    class="border rounded-lg p-4 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
    :class="{ 'border-indigo-500 bg-indigo-50': isSelected }"
    @click="$emit('select')"
  >
    <div class="flex items-center">
      <div>
        <input
          type="radio"
          :id="inputId"
          :name="name"
          :value="value"
          :checked="modelValue === value"
          class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          @change="$emit('update:modelValue', $event.target.value)"
        />
      </div>
      <div class="ml-3 flex-1">
        <label :for="inputId" class="text-lg font-medium text-gray-900 block">
          {{ title }}
        </label>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  inputId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  modelValue: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

defineEmits(['select', 'update:modelValue']);
</script> 