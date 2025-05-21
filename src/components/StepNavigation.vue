<template>
  <div class="mt-8 flex justify-between">
    <slot name="back">
      <ActionButton 
        v-if="showBackButton" 
        variant="secondary" 
        @click="$emit('back')"
      >
        <svg class="mr-2 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        Retour
      </ActionButton>
    </slot>
    
    <slot name="next">
      <ActionButton 
        :disabled="nextDisabled" 
        @click="$emit('next')"
      >
        <slot name="next-text">Continuer</slot>
        <svg class="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </ActionButton>
    </slot>
  </div>
</template>

<script setup>
import ActionButton from './ActionButton.vue';

defineProps({
  showBackButton: {
    type: Boolean,
    default: true
  },
  nextDisabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['back', 'next']);
</script> 