import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { vehicleService, appointmentService, garageService, operationService, categoryService } from '../js/api'

export const useGarageStore = defineStore('garage', () => {
  const vehicles = ref([])
  const garages = ref([])
  const operationCategories = ref([])
  const operations = ref([])
  const appointments = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const fetchVehicles = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await vehicleService.getAll();
      vehicles.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des véhicules';
      console.error(error.value);
    } finally {
      loading.value = false;
    }
  };

  const fetchGarages = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await garageService.getAll();
      
      if (response.data && response.data.garages && Array.isArray(response.data.garages)) {
        garages.value = response.data.garages;
      } else if (Array.isArray(response.data)) {
        garages.value = response.data;
      } else {
        garages.value = [];
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des garages';
      console.error(err);
      garages.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await categoryService.getAll();
      
      if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
        operationCategories.value = response.data.categories;
      } else if (Array.isArray(response.data)) {
        operationCategories.value = response.data;
      } else {
        operationCategories.value = [];
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des catégories';
      console.error(err);
      operationCategories.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchOperations = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await operationService.getAll();
      
      if (response.data && response.data.operations && Array.isArray(response.data.operations)) {
        operations.value = response.data.operations;
      } else if (Array.isArray(response.data)) {
        operations.value = response.data;
      } else {
        operations.value = [];
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des opérations';
      console.error(err);
      operations.value = [];
    } finally {
      loading.value = false;
    }
  };

  const fetchAppointments = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentService.getAll();
      appointments.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des rendez-vous';
      console.error(error.value);
    } finally {
      loading.value = false;
    }
  };
  
  const fetchAppointmentsByUser = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentService.getAppointmentsByUser();

      if (Array.isArray(response.data) && response.data.length > 0 && Array.isArray(response.data[0])) {
        appointments.value = response.data[0];
      } else {
        appointments.value = response.data;
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des rendez-vous de l\'utilisateur';
      console.error(error.value);
    } finally {
      loading.value = false;
    }
  };
  
  const getVehiclesByClientId = computed(() => {
    return () => vehicles.value;
  });
  
  const getOperationsByCategory = computed(() => {
    return (categoryId) => operations.value.filter(operation => operation.category === categoryId);
  });
  
  const getAppointmentsByVehicleId = computed(() => {
    return (vehicleId) => appointments.value.filter(appointment => appointment.vehicule_id === vehicleId);
  });
  
  const getOperationsByAppointmentId = computed(() => {
    return (appointmentId) => {
      const appointment = appointments.value.find(a => a.id === appointmentId);
      if (appointment && appointment.operations && Array.isArray(appointment.operations)) {
        return appointment.operations.map(operationId => {
          const operation = operations.value.find(o => o.id === operationId);
          return operation || { id: operationId, name: 'Opération inconnue' };
        });
      }
      return [];
    };
  });
  
  const addVehicle = async (vehicleData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await vehicleService.create(vehicleData);
      await fetchVehicles();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de l\'ajout du véhicule';
      console.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const updateVehicle = async (id, vehicleData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await vehicleService.update(id, vehicleData);
      await fetchVehicles();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la mise à jour du véhicule';
      console.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const createAppointment = async (appointmentData) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentService.create(appointmentData);
      await fetchAppointments();
      return response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur lors de la création du rendez-vous';
      console.error(error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const generateTimeSlots = async (garageId, date, selectedOperations) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await appointmentService.getAvailabilities(garageId, date);
      
      if (response.data && response.data.availabilities && Array.isArray(response.data.availabilities)) {
        return response.data.availabilities;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data) {
        return response.data;
      }
      
      return [];
    } catch (err) {
      error.value = err.response?.data?.message || 'Erreur de chargement des créneaux';
      console.error(err);
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  const initializeStore = async () => {
    try {
      await Promise.all([
        fetchVehicles(),
        fetchGarages(),
        fetchCategories(),
        fetchOperations(),
        fetchAppointmentsByUser()
      ]);
      
    } catch (err) {
      console.error('Erreur lors de l\'initialisation du store:', err);
    }
  };
  
  return {
    vehicles,
    garages,
    operationCategories,
    operations,
    appointments,
    loading,
    error,
    
    getVehiclesByClientId,
    getOperationsByCategory,
    getAppointmentsByVehicleId,
    getOperationsByAppointmentId,
    
    fetchVehicles,
    fetchGarages,
    fetchCategories,
    fetchOperations,
    fetchAppointments,
    fetchAppointmentsByUser,
    
    addVehicle,
    updateVehicle,
    createAppointment,
    generateTimeSlots,
    initializeStore
  }
}) 