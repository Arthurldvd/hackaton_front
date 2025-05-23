<template>
  <li class="px-4 py-4 sm:px-6 hover:bg-gray-50" :class="{'sm:py-5': !compact}">
    <div class="flex flex-col sm:flex-row" :class="{'sm:items-center gap-4': !compact, 'items-center justify-between': compact}">
      <div v-if="compact" class="flex items-center">
        <div class="flex-shrink-0">
          <div :class="`h-10 w-10 rounded-full flex items-center justify-center ${statusClasses.bg}`">
            <svg class="h-6 w-6" :class="statusClasses.text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-900">
            {{ formattedDate }}
          </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ garageName }}
          </div>
          <div class="text-sm text-gray-500">
            <StatusBadge 
              :status="appointment.status" 
              :text="statusText" 
            />
          </div>
        </div>
      </div>
      
      <template v-else>
        <div class="flex-shrink-0">
          <div :class="`h-12 w-12 rounded-full flex items-center justify-center ${statusClasses.bg}`">
            <svg class="h-6 w-6" :class="statusClasses.text" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p class="text-lg font-medium text-gray-900 truncate">
              {{ formattedDate }}
            </p>
            <StatusBadge 
              :status="appointment.status" 
              :text="statusText" 
            />
          </div>
          <div class="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div class="flex items-center text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {{ garageName }}
            </div>
            <div v-if="vehicleName" class="flex items-center text-sm text-gray-500">
              <svg class="h-6 w-6 text-grey-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
              {{ vehicleName }}
            </div>
          </div>
          <div v-if="operationsSummary" class="mt-1 text-sm text-gray-500">
            {{ operationsSummary }}
          </div>
        </div>
      </template>
      
      <div class="mt-3 sm:mt-0" :class="{'w-full sm:w-auto': !compact}">
        <slot name="actions"></slot>
        <button 
          @click="downloadPdf" 
          type="button" 
          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg class="mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Télécharger PDF
        </button>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed } from 'vue';
import StatusBadge from './StatusBadge.vue';
import { appointmentService } from '../js/api';

const props = defineProps({
  appointment: {
    type: Object,
    required: true
  },
  formattedDate: {
    type: String,
    required: true
  },
  garageName: {
    type: String,
    required: true
  },
  vehicleName: {
    type: String,
    default: ''
  },
  operationsSummary: {
    type: String,
    default: ''
  },
  statusText: {
    type: String,
    required: true
  },
  statusClasses: {
    type: Object,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
});

const downloadPdf = async () => {
  try {
    const response = await appointmentService.getPdf(props.appointment.id);
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `rendez-vous-${props.appointment.id}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Erreur lors du téléchargement du PDF:', error);
    alert('Impossible de télécharger le PDF du rendez-vous');
  }
};

</script> 