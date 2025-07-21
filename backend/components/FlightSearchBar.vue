<template>
  <div class="w-full max-w-md">
    <input
        type="search"
        placeholder="Search flights by flight number or destination..."
        v-model="localSearch"
        @input="updateSearch"
        class="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        aria-label="Flight search input"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, defineProps } from 'vue'

const props = defineProps<{ searchTerm: string }>()
const emit = defineEmits(['update:searchTerm'])

const localSearch = ref(props.searchTerm ?? '')

watch(() => props.searchTerm, val => {
  localSearch.value = val ?? ''
})

function updateSearch() {
  emit('update:searchTerm', localSearch.value)
}
</script>
