<template>
  <div class="w-full py-4">
    <div class="flex justify-between relative">
      <!-- Étapes -->
      <div v-for="(step, index) in steps" :key="step.id" class="z-10 flex flex-col items-center">
        <!-- Cercle indicateur -->
        <div 
          :class="[
            'flex items-center justify-center rounded-full border-2 transition-all duration-200',
            currentStep > index 
              ? 'bg-indigo-500 border-indigo-500 text-white w-10 h-10' 
              : currentStep === index 
              ? 'bg-white border-indigo-500 text-indigo-500 w-12 h-12 shadow-md ring-4 ring-indigo-100' 
              : 'bg-white border-gray-200 text-gray-400 w-10 h-10'
          ]"
        >
          <svg v-if="currentStep > index" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
          <span v-else :class="['font-semibold', currentStep === index ? 'text-indigo-500 text-lg' : 'text-gray-500 text-sm']">
            {{ index + 1 }}
          </span>
        </div>
        
        <!-- Nom de l'étape -->
        <div class="mt-3 text-center">
          <span 
            :class="[
              'font-medium transition-all duration-200', 
              currentStep === index 
                ? 'text-indigo-600 text-base' 
                : currentStep > index 
                ? 'text-indigo-500 text-sm' 
                : 'text-gray-500 text-sm'
            ]"
          >
            {{ step.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
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