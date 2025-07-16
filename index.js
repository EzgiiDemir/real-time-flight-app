const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const axios = require('axios');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Serve static files for the test client
app.use(express.static(__dirname));

// Serve the HTML file at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API Configuration
const API_CONFIG = {
    baseURL: 'https://aerodatabox.p.rapidapi.com',
    headers: {
        'X-RapidAPI-Key': '7cfdee80e4msh43c29957290d274p142066jsn17e5fd183b9f',
        'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
    }
};

// Flight data fetching function
async function fetchFlightData(codeType = 'iata', code = 'ECN') {
    try {
        const response = await axios.get(
            `${API_CONFIG.baseURL}/flights/airports/${codeType}/${code}`,
            {
                headers: API_CONFIG.headers,
                params: {
                    offsetMinutes: -120,
                    durationMinutes: 720,
                    withLeg: true,
                    direction: 'Both',
                    withCancelled: true,
                    withCodeshared: true,
                    withCargo: true,
                    withPrivate: true,
                    withLocation: false
                }
            }
        );

        return {
            success: true,
            data: response.data,
            timestamp: new Date().toISOString(),
            airport: code,
            codeType: codeType
        };
    } catch (error) {
        console.error('Error fetching flight data:', error.message);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString(),
            airport: code,
            codeType: codeType
        };
    }
}

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Send initial flight data
    fetchFlightData().then(data => {
        socket.emit('flightData', data);
    });

    // Handle custom airport code requests
    socket.on('setAirport', (params) => {
        const { codeType = 'iata', code = 'ECN' } = params;
        console.log(`Client ${socket.id} requested airport: ${code} (${codeType})`);

        // Store client preferences
        socket.airportCode = code;
        socket.codeType = codeType;

        // Send immediate update
        fetchFlightData(codeType, code).then(data => {
            socket.emit('flightData', data);
        });
    });

    socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

// Periodic data fetching and broadcasting
setInterval(async () => {
    console.log('Fetching flight data for all clients...');

    // Get all connected clients
    const sockets = await io.fetchSockets();

    // Group clients by their airport preferences
    const airportGroups = {};

    sockets.forEach(socket => {
        const codeType = socket.codeType || 'iata';
        const code = socket.airportCode || 'ECN';
        const key = `${codeType}:${code}`;

        if (!airportGroups[key]) {
            airportGroups[key] = { codeType, code, sockets: [] };
        }
        airportGroups[key].sockets.push(socket);
    });

    // Fetch data for each unique airport and broadcast to respective clients
    for (const [key, group] of Object.entries(airportGroups)) {
        const flightData = await fetchFlightData(group.codeType, group.code);

        group.sockets.forEach(socket => {
            socket.emit('flightData', flightData);
        });
    }
}, 60000); // 60 seconds interval

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        connectedClients: io.engine.clientsCount
    });
});

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Flight data server running on port ${PORT}`);
    console.log(`Test client available at: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('Shutting down gracefully...');
    httpServer.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});