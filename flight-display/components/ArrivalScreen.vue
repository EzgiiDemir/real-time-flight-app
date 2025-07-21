<template>
  <div class=" bg-gradient-to-br from-sky-900 to-gray-950 text-white flex flex-col items-center px-4 py-6">
    <!-- Header -->
    <header class="text-center mb-10 select-none">
      <h1 class="text-5xl font-extrabold tracking-widest drop-shadow-lg flex items-center justify-center gap-3">
        🛬 ARRIVALS
      </h1>
      <p class="mt-2 text-lg text-sky-300 font-semibold">
        Live Flight Arrival Information
      </p>
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

      <!-- Refresh Button -->

    </section>

    <!-- Flight Table -->
    <section class="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
      <div class="hidden md:block overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
          <tr class="bg-sky-800/50 text-sky-200 text-left">
            <th class="p-4">Flight</th>
            <th class="p-4">From</th>
            <th class="p-4">Arrival</th>
            <th class="p-4">Gate</th>
            <th class="p-4">Status</th>
            <th class="p-4">Aircraft</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="flight in paginatedFlights"
              :key="flight.flightNumber"
              class="border-b border-sky-800/30 hover:bg-sky-900/30 transition"
          >
            <td class="p-4 font-bold">{{ flight.airline }} {{ flight.flightNumber }}</td>
            <td class="p-4">
              <div class="font-bold">{{ flight.departure.airport }}</div>
              <div class="text-sm text-sky-300">{{ flight.departure.country }}</div>
            </td>
            <td class="p-4 font-mono">{{ formatDate(flight.arrival.scheduledTime) }}</td>
            <td class="p-4 text-center font-bold text-xl">{{ flight.gate || 'A2' }}</td>
            <td class="p-4">
                <span
                    :class="statusClass(flight.status)"
                    class="px-3 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-2"
                >
                  <span :class="statusSignalClass(flight.status)" class="w-2 h-2 rounded-full"></span>
                  {{ flight.status }}
                </span>
            </td>
            <td class="p-4 text-sky-300">{{ flight.aircraft }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col md:flex-row justify-between items-center p-4 border-t border-sky-800/30 gap-4">
        <div class="text-sky-300 text-sm">Total {{ filteredFlights.length }} flights</div>
        <div class="flex items-center gap-4">
          <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span class="text-sky-300">Page {{ currentPage }}</span>
          <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{ flights: any }>()

const currentPage = ref(1)
const itemsPerPage = 6
const searchQuery = ref('')
const statusFilter = ref('all')
const selectedDate = ref('')

// Fetch (dummy)
function fetchFlights() {
  console.log("Flights refreshed")
}

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

  return flights
})

const totalPages = computed(() => Math.ceil(filteredFlights.value.length / itemsPerPage))

const paginatedFlights = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredFlights.value.slice(start, start + itemsPerPage)
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function formatDate(dateStr: string) {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateStr).toLocaleString(undefined, options)
}

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case 'delayed': return 'bg-red-600/20 text-red-300'
    case 'boarding': return 'bg-green-600/20 text-green-300'
    case 'cancelled': return 'bg-gray-600/20 text-gray-300'
    case 'on-time': return 'bg-sky-600/20 text-sky-300'
    default: return 'bg-sky-600/20 text-sky-300'
  }
}

function statusSignalClass(status: string) {
  switch (status.toLowerCase()) {
    case 'delayed': return 'bg-red-400 animate-pulse'
    case 'boarding': return 'bg-green-400 animate-pulse'
    case 'cancelled': return 'bg-gray-400'
    case 'on-time': return 'bg-sky-400 animate-pulse'
    default: return 'bg-sky-400 animate-pulse'
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
