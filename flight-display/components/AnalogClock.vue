<template>
  <div class="w-20 h-20 rounded-full border-4 border-gray-700 dark:border-gray-300 bg-white dark:bg-gray-800 relative shadow-md">
    <div
        class="hand hour-hand"
        :style="{ transform: `rotate(${hourRotation}deg)` }"
    ></div>
    <div
        class="hand minute-hand"
        :style="{ transform: `rotate(${minuteRotation}deg)` }"
    ></div>
    <div
        class="hand second-hand bg-red-600"
        :style="{ transform: `rotate(${secondRotation}deg)` }"
    ></div>
    <div class="center-dot"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const hourRotation = ref(0)
const minuteRotation = ref(0)
const secondRotation = ref(0)

function updateClock() {
  const now = new Date()
  const seconds = now.getSeconds()
  const minutes = now.getMinutes()
  const hours = now.getHours() % 12

  secondRotation.value = seconds * 6
  minuteRotation.value = minutes * 6 + seconds * 0.1
  hourRotation.value = hours * 30 + minutes * 0.5
}

let interval: number

onMounted(() => {
  updateClock()
  interval = window.setInterval(updateClock, 1000)
})

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.hand {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform-origin: bottom center;
  border-radius: 2px;
  background-color: #333;
  transition: transform 0.1s ease-in-out;
}

.hour-hand {
  width: 5px;
  height: 30%;
  background-color: #1f2937;
  z-index: 3;
}

.minute-hand {
  width: 3px;
  height: 40%;
  background-color: #374151;
  z-index: 2;
}

.second-hand {
  width: 2px;
  height: 45%;
  background-color: #ef4444;
  z-index: 4;
}

.center-dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 12px;
  background-color: #374151;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  z-index: 5;
}
</style>
