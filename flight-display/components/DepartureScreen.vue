<template>
  <div class="bg-gradient-to-br from-sky-900 to-gray-950 text-white flex flex-col items-center px-4 py-6">
    <!-- Header -->
    <header class="w-full max-w-6xl text-center mb-10 select-none">
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-wider drop-shadow-lg flex justify-center items-center gap-3">
        🛫 SKYPORT AIRPORT
      </h1>
      <p class="text-md md:text-lg text-sky-300 font-semibold mt-2">
        Live Flight Information Display System
      </p>
      <div class="mt-2 text-sky-200 flex justify-center items-center gap-2 text-sm md:text-base">
        <i class="far fa-clock"></i>
        {{ currentDateTime }}
      </div>
    </header>

    <!-- Filters -->
    <section class="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label class="block text-sm text-sky-300 mb-2">Search Flight</label>
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Flight number or airline"
            class="w-full bg-sky-900/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500"
        />
      </div>
      <div>
        <label class="block text-sm text-sky-300 mb-2">Status</label>
        <select
            v-model="statusFilter"
            class="w-full bg-black rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500"
        >
          <option value="all">All</option>
          <option value="on-time">On Time</option>
          <option value="boarding">Boarding</option>
          <option value="delayed">Delayed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div>
        <label class="block text-sm text-sky-300 mb-2">Date</label>
        <input
            v-model="selectedDate"
            type="date"
            class="w-full bg-sky-900/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-sky-500"
        />
      </div>
    </section>

    <!-- FLIGHT TABLE: Mobile / Easy Data Table -->
    <section class="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden md:hidden p-4">
      <EasyDataTable
          :headers="easyHeaders"
          :items="easyItems"
          :search-value="searchQuery"
          table-class-name="text-white"
          header-text-direction="center"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const props = defineProps({ flights: Object })
const emit = defineEmits(['refresh'])

const searchQuery = ref('')
const statusFilter = ref('all')
const selectedDate = ref('')
const currentPage = ref(1)
const itemsPerPage = 6
const currentDateTime = ref('')

const filteredFlights = computed(() => {
  let list = props.flights?.departures || []
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(f =>
        f.flightNumber.toLowerCase().includes(query) ||
        f.airline.toLowerCase().includes(query)
    )
  }
  if (statusFilter.value !== 'all') {
    list = list.filter(f => f.status.toLowerCase() === statusFilter.value)
  }
  if (selectedDate.value) {
    const selected = new Date(selectedDate.value).toDateString()
    list = list.filter(f =>
        new Date(f.departure.scheduledTime).toDateString() === selected
    )
  }
  return list
})

const paginatedFlights = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredFlights.value.slice(start, start + itemsPerPage)
})

const totalPages = computed(() => Math.ceil(filteredFlights.value.length / itemsPerPage))

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function formatDate(str) {
  const date = new Date(str)
  return date.toLocaleString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short'
  })
}

function statusClass(status) {
  switch (status.toLowerCase()) {
    case 'delayed': return 'bg-red-600/20 text-red-300'
    case 'boarding': return 'bg-green-600/20 text-green-300'
    case 'cancelled': return 'bg-gray-600/20 text-gray-300'
    case 'on-time': return 'bg-sky-600/20 text-sky-300'
    default: return 'bg-sky-600/20 text-sky-300'
  }
}
function statusSignalClass(status) {
  switch (status.toLowerCase()) {
    case 'delayed': return 'bg-red-400 animate-pulse'
    case 'boarding': return 'bg-green-400 animate-pulse'
    case 'cancelled': return 'bg-gray-400'
    case 'on-time': return 'bg-sky-400 animate-pulse'
    default: return 'bg-sky-400 animate-pulse'
  }
}

function updateDateTime() {
  const now = new Date()
  currentDateTime.value = now.toLocaleString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  updateDateTime()
  setInterval(updateDateTime, 60000)
  selectedDate.value = new Date().toISOString().split('T')[0]
})

const easyHeaders = [
  { text: 'Flight', value: 'flight' },
  { text: 'Destination', value: 'destination' },
  { text: 'Departure', value: 'departure' },
  { text: 'Gate', value: 'gate' },
  { text: 'Status', value: 'status' }
]

const easyItems = computed(() =>
    filteredFlights.value.map(f => ({
      flight: `${f.airline} ${f.flightNumber}`,
      destination: f.arrival.airport,
      departure: formatDate(f.departure.scheduledTime),
      gate: f.gate || 'A5',
      status: f.status
    }))
)
</script>
