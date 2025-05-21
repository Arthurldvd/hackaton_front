import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export const useGarageStore = defineStore('garage', () => {
  const vehicles = ref([
    {
      id: '1',
      clientId: '1',
      brand: 'Renault',
      model: 'Clio',
      licensePlate: 'AB-123-CD',
      vin: 'VF1RFA00066123456',
      registrationDate: '2018-05-12',
      mileage: 75000
    },
    {
      id: '2',
      clientId: '1',
      brand: 'Peugeot',
      model: '308',
      licensePlate: 'EF-456-GH',
      vin: 'VF3LCRFJOBS123456',
      registrationDate: '2020-11-03',
      mileage: 25000
    }
  ])
  
  const garages = ref([
    {
      id: '1',
      name: 'Garage Central',
      city: 'Paris',
      address: '15 rue de la Paix',
      zipcode: '75001',
      latitude: 48.8667,
      longitude: 2.3333
    },
    {
      id: '2',
      name: 'Auto Service Plus',
      city: 'Lyon',
      address: '27 avenue Jean Jaurès',
      zipcode: '69007',
      latitude: 45.7485,
      longitude: 4.8467
    },
    {
      id: '3',
      name: 'Mécanique Express',
      city: 'Marseille',
      address: '42 boulevard du Prado',
      zipcode: '13008',
      latitude: 43.2804,
      longitude: 5.3806
    }
  ])
  
  const operationCategories = ref([
    {
      id: '1',
      name: 'Entretien régulier'
    },
    {
      id: '2',
      name: 'Réparation mécanique'
    },
    {
      id: '3',
      name: 'Carrosserie'
    },
    {
      id: '4',
      name: 'Pneumatiques'
    }
  ])
  
  const operations = ref([
    {
      id: '1',
      categoryId: '1',
      name: 'Vidange + filtres',
      additionalHelp: 'Inclut vidange huile, remplacement filtre huile et filtre habitacle',
      additionalComment: 'Recommandé tous les 15 000 km ou 1 an',
      timeUnit: 60, 
      price: 129.99
    },
    {
      id: '2',
      categoryId: '1',
      name: 'Révision complète',
      additionalHelp: 'Contrôle général du véhicule + vidange + filtres',
      additionalComment: 'Recommandé tous les 30 000 km ou 2 ans',
      timeUnit: 120,
      price: 249.99
    },
    {
      id: '3',
      categoryId: '2',
      name: 'Remplacement plaquettes de frein',
      additionalHelp: 'Changement des plaquettes avant ou arrière',
      additionalComment: 'Selon usure, généralement tous les 30 000 à 40 000 km',
      timeUnit: 90,
      price: 179.99
    },
    {
      id: '4',
      categoryId: '2',
      name: 'Remplacement courroie de distribution',
      additionalHelp: 'Inclut courroie, galets et pompe à eau',
      additionalComment: 'À effectuer selon préconisation constructeur',
      timeUnit: 240,
      price: 499.99
    },
    {
      id: '5',
      categoryId: '3',
      name: 'Réparation de carrosserie',
      additionalHelp: 'Réparation et peinture de la zone endommagée',
      additionalComment: 'Sur devis selon l\'étendue des dégâts',
      timeUnit: 180,
      price: 399.99
    },
    {
      id: '6',
      categoryId: '4',
      name: 'Changement de pneus',
      additionalHelp: 'Remplacement des pneumatiques par train (2 ou 4)',
      additionalComment: 'Inclut équilibrage et parallélisme',
      timeUnit: 60,
      price: 89.99
    }
  ])
  
  const appointments = ref([
    {
      id: '1',
      vehicleId: '1',
      garageId: '1',
      appointmentDatetime: '2023-05-15T10:00:00',
      status: 'completed',
      notes: 'Vidange effectuée',
      createdAt: '2023-04-30T14:22:05',
      updatedAt: '2023-05-15T12:15:33'
    }
  ])
  
  const appointmentOperations = ref([
    {
      appointmentId: '1',
      operationId: '1'
    }
  ])
  
  const getVehiclesByClientId = computed(() => {
    return (clientId) => vehicles.value.filter(vehicle => vehicle.clientId === clientId)
  })
  
  const getOperationsByCategory = computed(() => {
    return (categoryId) => operations.value.filter(operation => operation.categoryId === categoryId)
  })
  
  const getAppointmentsByVehicleId = computed(() => {
    return (vehicleId) => appointments.value.filter(appointment => appointment.vehicleId === vehicleId)
  })
  
  const getOperationsByAppointmentId = computed(() => {
    return (appointmentId) => {
      const operationIds = appointmentOperations.value
        .filter(ao => ao.appointmentId === appointmentId)
        .map(ao => ao.operationId)
      
      return operations.value.filter(operation => operationIds.includes(operation.id))
    }
  })
  
  const addVehicle = (vehicleData) => {
    const newVehicle = {
      id: uuidv4(),
      ...vehicleData
    }
    vehicles.value.push(newVehicle)
    return newVehicle
  }
  
  const updateVehicle = (id, vehicleData) => {
    const index = vehicles.value.findIndex(v => v.id === id)
    if (index !== -1) {
      vehicles.value[index] = { ...vehicles.value[index], ...vehicleData }
      return vehicles.value[index]
    }
    return null
  }
  
  const createAppointment = (appointmentData, operationIds) => {
    const newAppointment = {
      id: uuidv4(),
      ...appointmentData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    appointments.value.push(newAppointment)
    
    operationIds.forEach(operationId => {
      appointmentOperations.value.push({
        appointmentId: newAppointment.id,
        operationId
      })
    })
    
    return newAppointment
  }
  
  const updateAppointmentStatus = (id, status) => {
    const index = appointments.value.findIndex(a => a.id === id)
    if (index !== -1) {
      appointments.value[index].status = status
      appointments.value[index].updatedAt = new Date().toISOString()
      return appointments.value[index]
    }
    return null
  }
  
  const generateTimeSlots = (garageId, date, operations) => {
    const slots = []
    
    const totalDuration = operations.reduce((sum, opId) => {
      const operation = operations.value.find(op => op.id === opId)
      return sum + (operation ? operation.timeUnit : 0)
    }, 0)
    
    const openingHour = 8
    const closingHour = 18
    
    const selectedDate = new Date(date)
    
    for (let hour = openingHour; hour < closingHour; hour++) {
      for (let minutes = 0; minutes < 60; minutes += 30) {
        const startTime = new Date(selectedDate)
        startTime.setHours(hour, minutes, 0)
        
        const endTime = new Date(startTime)
        endTime.setMinutes(endTime.getMinutes() + totalDuration)
        
        if (endTime.getHours() < closingHour || 
            (endTime.getHours() === closingHour && endTime.getMinutes() === 0)) {
          
          const isAvailable = Math.random() > 0.3 
          
          if (isAvailable) {
            slots.push({
              start: startTime.toISOString(),
              end: endTime.toISOString(),
              duration: totalDuration
            })
          }
        }
      }
    }
    
    return slots
  }
  
  return {
    vehicles,
    garages,
    operationCategories,
    operations,
    appointments,
    appointmentOperations,
    
    getVehiclesByClientId,
    getOperationsByCategory,
    getAppointmentsByVehicleId,
    getOperationsByAppointmentId,
    
    addVehicle,
    updateVehicle,
    createAppointment,
    updateAppointmentStatus,
    generateTimeSlots
  }
}) 