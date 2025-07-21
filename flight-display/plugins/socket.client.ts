import { defineNuxtPlugin } from 'nuxt/app';
import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
    const socket = io('http://localhost:3003'); // Backend URL

    return {
        provide: {
            socket,
        },
    };
});
