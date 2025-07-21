import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { FlightsService } from './flights.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class FlightGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private readonly flightService: FlightsService) {
        this.startEmitting();
    }

    afterInit(server: Server) {
        console.log('WebSocket server initialized');
    }

    handleConnection(client: any) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: any) {
        console.log(`Client disconnected: ${client.id}`);
    }

    startEmitting() {
        setInterval(() => {
            this.flightService.updateFlightStatuses();
            const data = {
                departures: this.flightService.getDepartures(),
                arrivals: this.flightService.getArrivals(),
                ads: this.flightService.getAds(),
                timestamp: new Date().toISOString(),
            };
            this.server.emit('flight_update', data);
        }, 5000);
    }
}
