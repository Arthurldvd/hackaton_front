<template>
  <li class="py-3">
    <div class="flex items-center justify-between">
      <div>
        <p class="font-medium text-gray-900">{{ title }}</p>
        <slot></slot>
      </div>
      <router-link v-if="link" :to="link" :class="`text-${color}-600 hover:text-${color}-900 text-sm font-medium`">
        {{ linkText }}
      </router-link>
      <slot name="action" v-else></slot>
    </div>
  </li>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: ''
  },
  linkText: {
    type: String,
    default: 'Détails'
  },
  color: {
    type: String,
    default: 'indigo'
  }
});
</script> 