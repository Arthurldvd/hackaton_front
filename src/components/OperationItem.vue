<template>
  <div class="flex items-start space-x-3">
    <div class="flex items-center h-5 mt-1">
      <input
        :id="inputId"
        name="operations"
        type="checkbox"
        :value="value"
        :checked="modelValue.includes(value)"
        class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
        @change="handleChange"
      />
    </div>
    <div class="flex-1">
      <div class="flex justify-between">
        <label
          :for="inputId"
          class="text-sm font-medium text-gray-900"
        >
          {{ name }}
        </label>
        <span class="text-sm font-medium text-gray-900">
          {{ formattedPrice }}
        </span>
      </div>
      <p
        v-if="additionalHelp"
        class="mt-1 text-sm text-gray-500"
      >
        {{ additionalHelp }}
      </p>
      <p
        v-if="additionalComment"
        class="mt-1 text-xs italic text-gray-500"
      >
        {{ additionalComment }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  inputId: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  modelValue: {
    type: Array,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  formattedPrice: {
    type: String,
    required: true
  },
  additionalHelp: {
    type: String,
    default: ''
  },
  additionalComment: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const handleChange = (event) => {
  const isChecked = event.target.checked;
  const newValue = [...props.modelValue];
  
  if (isChecked && !newValue.includes(props.value)) {
    newValue.push(props.value);
  } else if (!isChecked && newValue.includes(props.value)) {
    const index = newValue.indexOf(props.value);
    newValue.splice(index, 1);
  }
  
  emit('update:modelValue', newValue);
};
</script> 