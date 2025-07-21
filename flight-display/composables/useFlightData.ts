import { ref, onMounted } from 'vue';
import { io, Socket } from 'socket.io-client';

const socket = ref<Socket | null>(null);
const flightData = ref({
    departures: [],
    arrivals: [],
    ads: [],
    timestamp: '',
});

export default function useFlightData() {
    onMounted(() => {
        socket.value = io('http://localhost:3001');

        socket.value.on('connect', () => {
            console.log('Connected to socket server');
        });

        socket.value.on('flight_update', (data) => {
            flightData.value = data;
        });

        socket.value.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });
    });

    return { flightData };
}
