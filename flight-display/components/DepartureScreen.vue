<template>
  <div class="bg-gradient-to-br from-sky-900 to-gray-950 text-white flex flex-col items-center px-4 py-6 min-h-screen">
    <!-- Header -->
    <header class="w-full max-w-6xl text-center mb-10 select-none">
      <p class="text-md md:text-lg text-sky-300 font-semibold mt-2">
        Live Flight Information Display System
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
            class="w-full bg-sky-900/50 rounded-lg px-4 py-2 text-white placeholder-sky-400 focus:ring-2 focus:ring-sky-500 transition"
            autocomplete="off"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm text-sky-300 mb-2">Status</label>
        <select
            v-model="statusFilter"
            class="w-full bg-sky-900/70 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 transition"
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
            class="w-full bg-sky-900/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500 transition"
        />
      </div>
    </section>

    <!-- Mobile DataTable (Departures) -->
    <section
        class="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden md:hidden p-4 mt-10"
    >
      <EasyDataTable
          :headers="departureHeaders"
          :items="filteredDepartures"
          :search-value="searchQuery"
          table-class-name="text-white"
          header-text-direction="center"
          :rows-per-page="12"
          show-index
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const props = defineProps<{ flights: { arrivals: any[], departures: any[] } }>()

const searchQuery = ref('')
const statusFilter = ref('all')
const selectedDate = ref('')
const currentDateTime = ref('')

// --- Format helpers ---
function formatDate(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }
  return new Date(dateStr).toLocaleString(undefined, options)
}

function formatStatus(status: string) {
  switch (status.toLowerCase()) {
    case 'delayed':
      return 'Delayed ❌'
    case 'boarding':
      return 'Boarding ✈'
    case 'cancelled':
      return 'Cancelled ⛔'
    case 'on-time':
      return 'On Time ⏳'
    default:
      return status
  }
}

// --- Filtered Arrivals ---
const filteredArrivals = computed(() => {
  let flights = props.flights?.arrivals || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    flights = flights.filter(
        (f) =>
            f.flightNumber.toLowerCase().includes(query) ||
            f.airline.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value !== 'all') {
    flights = flights.filter((f) => f.status.toLowerCase() === statusFilter.value)
  }

  if (selectedDate.value) {
    flights = flights.filter(
        (f) =>
            new Date(f.arrival.scheduledTime).toDateString() ===
            new Date(selectedDate.value).toDateString()
    )
  }

  return flights.map((flight) => ({
    flightCode: `${flight.airline} ${flight.flightNumber}`,
    from: `${flight.departure.airport} (${flight.departure.country})`,
    arrival: formatDate(flight.arrival.scheduledTime),
    gate: flight.gate || 'A2',
    statusDisplay: formatStatus(flight.status),
    aircraft: flight.aircraft,
  }))
})

// --- Filtered Departures ---
const filteredDepartures = computed(() => {
  let flights = props.flights?.departures || []

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    flights = flights.filter(
        (f) =>
            f.flightNumber.toLowerCase().includes(query) ||
            f.airline.toLowerCase().includes(query)
    )
  }

  if (statusFilter.value !== 'all') {
    flights = flights.filter((f) => f.status.toLowerCase() === statusFilter.value)
  }

  if (selectedDate.value) {
    flights = flights.filter(
        (f) =>
            new Date(f.departure.scheduledTime).toDateString() ===
            new Date(selectedDate.value).toDateString()
    )
  }

  return flights.map((f) => ({
    flight: `${f.airline} ${f.flightNumber}`,
    destination: f.arrival.airport,
    departure: formatDate(f.departure.scheduledTime),
    gate: f.gate || 'A5',
    status: formatStatus(f.status),
  }))
})

// --- Headers ---
const arrivalHeaders = [
  { text: 'Flight', value: 'flightCode' },
  { text: 'From', value: 'from' },
  { text: 'Arrival', value: 'arrival' },
  { text: 'Gate', value: 'gate' },
  { text: 'Status', value: 'statusDisplay' },
  { text: 'Aircraft', value: 'aircraft' },
]

const departureHeaders = [
  { text: 'Flight', value: 'flight' },
  { text: 'Destination', value: 'destination' },
  { text: 'Departure', value: 'departure' },
  { text: 'Gate', value: 'gate' },
  { text: 'Status', value: 'status' },
]

// --- Current Date Time ---
function updateDateTime() {
  const now = new Date()
  currentDateTime.value = now.toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 60000)
  selectedDate.value = new Date().toISOString().split('T')[0]
})
</script>

<style scoped>
select option {
  background-color: #0c4a6e;
  color: white;
}
</style>
