<template>
  <nav aria-label="Progress">
    <ol role="list" class="flex items-center">
      <li v-for="(step, index) in steps" :key="step.id" :class="[index !== 0 ? 'ml-8 sm:ml-16' : '', 'relative']">
        <div v-if="index !== 0" class="absolute inset-0 flex items-center" aria-hidden="true">
          <div :class="[currentStep > index ? 'bg-indigo-600' : 'bg-gray-200', 'h-0.5 w-full']"></div>
        </div>
        <div :class="[
          currentStep > index ? 'bg-indigo-600' : currentStep === index ? 'bg-indigo-600' : 'bg-gray-200',
          'relative flex h-8 w-8 items-center justify-center rounded-full'
        ]">
          <svg v-if="currentStep > index" class="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
          <span v-else :class="[currentStep === index ? 'text-white' : 'text-gray-500', 'text-sm font-medium']">
            {{ index + 1 }}
          </span>
        </div>
        <div class="relative ml-4 mt-2">
          <span :class="[currentStep >= index ? 'text-indigo-600' : 'text-gray-500', 'text-sm font-medium']">
            {{ step.name }}
          </span>
        </div>
      </li>
    </ol>
  </nav>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStep: {
    type: Number,
    required: true
  }
});
</script> 