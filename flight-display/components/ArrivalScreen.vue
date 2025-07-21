<template>
  <div class="bg-gradient-to-br from-sky-900 to-gray-950 text-white flex flex-col items-center px-4 py-6">
    <!-- Header -->
    <header class="w-full max-w-6xl text-center mb-10 select-none">
      <p class="text-md md:text-lg text-sky-300 font-semibold mt-2">
        Live Flight Arrival Information
      </p>
      <div class="mt-2 text-sky-200 flex justify-center items-center gap-2 text-sm md:text-base select-none">
        <i class="far fa-clock"></i>
        {{ currentDateTime }}
      </div>
    </header>

    <!-- Filters -->
    <section class="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Search -->
      <div>
        <label class="block text-sm text-sky-300 mb-2">Search Flight</label>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Flight number or airline"
            class="w-full bg-sky-900/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm text-sky-300 mb-2">Status</label>
        <select
            v-model="statusFilter"
            class="w-full bg-sky-900/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All</option>
          <option value="on-time">On Time</option>
          <option value="boarding">Boarding</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Date -->
      <div>
        <label class="block text-sm text-sky-300 mb-2">Date</label>
        <input
            v-model="selectedDate"
            type="date"
            class="w-full bg-sky-900/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </section>

    <!-- Easy DataTable -->
    <section class="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
      <EasyDataTable
          :headers="headers"
          :items="filteredFlights"
          :rows-per-page="6"
          show-index
          table-class-name="text-white"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const props = defineProps<{ flights: any }>()

const searchQuery = ref('')
const statusFilter = ref('all')
const selectedDate = ref('')

const headers = [
  { text: 'Flight', value: 'flightCode' },
  { text: 'From', value: 'from' },
  { text: 'Arrival', value: 'arrival' },
  { text: 'Gate', value: 'gate' },
  { text: 'Status', value: 'statusDisplay' },
  { text: 'Aircraft', value: 'aircraft' },
]

const filteredFlights = computed(() => {
  let flights = props.flights?.arrivals || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    flights = flights.filter(f =>
        f.flightNumber.toLowerCase().includes(query) ||
        f.airline.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value !== 'all') {
    flights = flights.filter(f => f.status.toLowerCase() === statusFilter.value)
  }

  if (selectedDate.value) {
    flights = flights.filter(f =>
        new Date(f.arrival.scheduledTime).toDateString() === new Date(selectedDate.value).toDateString()
    )
  }

  return flights.map(flight => ({
    flightCode: `${flight.airline} ${flight.flightNumber}`,
    from: `${flight.departure.airport} (${flight.departure.country})`,
    arrival: formatDate(flight.arrival.scheduledTime),
    gate: flight.gate || 'A2',
    statusDisplay: formatStatus(flight.status),
    aircraft: flight.aircraft
  }))
})

function formatDate(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateStr).toLocaleString(undefined, options)
}

function formatStatus(status: string) {
  switch (status.toLowerCase()) {
    case 'delayed': return 'Delayed ❌'
    case 'boarding': return 'Boarding ✈'
    case 'cancelled': return 'Cancelled ⛔'
    case 'on-time': return 'On Time ⏳'
    default: return status
  }
}

onMounted(() => {
  selectedDate.value = new Date().toISOString().split('T')[0]
})
</script>

<style scoped>
select option {
  background-color: #0c4a6e;
  color: white;
}
</style>
