<template>
  <div
      class="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-sky-900 to-gray-950 text-white relative overflow-hidden"
  >
    <!-- Başlık -->
    <header class="pt-10 pb-6 text-center animate-fade-in-down select-none">
      <h1
          class="text-4xl sm:text-5xl font-black tracking-widest drop-shadow-lg flex justify-center items-center gap-3"
      >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-sky-400 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
        >
          <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.5 6h9m-9 6h9m-7.5 6h7.5m-11-4.5l-3 3v-9m3 6l-3 3"
          />
        </svg>
        SKYPORT AIRPORT
      </h1>
      <p class="mt-2 text-sm sm:text-base text-gray-300 font-semibold tracking-wide">
        Live Flight Information Display System
      </p>
    </header>

    <!-- Tab Seçenekleri -->
    <nav
        class="flex justify-center space-x-6 bg-white/20 backdrop-blur rounded-xl p-2 mb-8 max-w-4xl w-full"
        role="tablist"
    >
      <button
          v-for="(tab, i) in tabs"
          :key="tab.name"
          @click="activeTab = i"
          :class="[
          'px-6 py-2 rounded-lg font-semibold transition-colors focus:outline-none',
          activeTab === i
            ? 'bg-white text-sky-900 shadow-lg shadow-sky-500/50'
            : 'text-white hover:bg-white/30',
        ]"
          aria-current="page"
          :aria-selected="activeTab === i"
          role="tab"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Aktif Bileşen -->
    <main
        class="w-full max-w-7xl px-4 sm:px-8 pb-12 rounded-xl shadow-2xl  backdrop-blur-lg text-black min-h-[600px] transition-all duration-500"
        role="tabpanel"
        :aria-labelledby="`tab-${activeTab}`"
    >
      <component :is="tabs[activeTab].component" :flights="flightData" />
    </main>

    <!-- Alt Kayan Duyuru -->
    <footer
        class="w-full bg-black/80 py-3 overflow-hidden fixed bottom-0 left-0 select-none"
        aria-live="polite"
        aria-atomic="true"
    >
      <div
          class="whitespace-nowrap animate-marquee text-yellow-400 text-sm sm:text-base font-semibold px-10"
          role="alert"
      >
        🟢 Flight TK123 to Istanbul is now boarding | 🟠 Gate B3 changed to B5 | 🔴 LH456 delayed 45 min | ☕ Free coffee at Gate C7 | Welcome to Skyport – your gateway to the world 🌍
      </div>
    </footer>

    <!-- Arka Plan Efektleri -->
    <div
        class="absolute inset-0 z-[-1] overflow-hidden pointer-events-none select-none"
        aria-hidden="true"
    >
      <div
          class="absolute w-72 h-72 bg-sky-500 opacity-20 rounded-full blur-3xl top-[-4rem] left-[-6rem] animate-pulse-fast"
      ></div>
      <div
          class="absolute w-96 h-96 bg-purple-700 opacity-20 rounded-full blur-3xl bottom-[-5rem] right-[-7rem] animate-pulse-slow"
      ></div>
      <!-- Uçak animasyonu -->
      <svg
          class="absolute top-12 right-10 w-20 h-20 text-sky-400 animate-fly"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1.5"
          aria-hidden="true"
      >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M2.5 19.5 19 12 2.5 4.5v7.5l10 0-10 0v7.5z"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import DepartureScreen from "../components/DepartureScreen.vue";
import ArrivalScreen from "../components/ArrivalScreen.vue";
import AdScreen from "../components/AdScreen.vue";
import Clock from "../components/Clock.vue";

import useFlightData from "../composables/useFlightData";

const { flightData } = useFlightData();

const tabs = [
  { name: "departure", label: "Departures", component: DepartureScreen },
  { name: "arrival", label: "Arrivals", component: ArrivalScreen },
  { name: "ads", label: "Ads", component: AdScreen },
  { name: "clock", label: "Clock", component: Clock },
];

const activeTab = ref(0);
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

@keyframes pulse-fast {
  0%,
  100% {
    opacity: 0.15;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.2);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.25;
    transform: scale(1.1);
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fly {
  0% {
    transform: translateX(0) rotate(0deg);
    opacity: 0.7;
  }
  50% {
    transform: translateX(-20px) rotate(-10deg);
    opacity: 1;
  }
  100% {
    transform: translateX(0) rotate(0deg);
    opacity: 0.7;
  }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}

.animate-pulse-fast {
  animation: pulse-fast 4s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-fade-in-down {
  animation: fadeInDown 0.8s ease-out both;
}

.animate-fly {
  animation: fly 4s ease-in-out infinite;
}
</style>
