import { Injectable } from '@nestjs/common';

export interface Flight {
    id: number;
    airline: string;
    flightNumber: string;
    status: string;
    departure: {
        airport: string;
        country: string;
        scheduledTime: string;
    };
    arrival: {
        airport: string;
        country: string;
        scheduledTime: string;
    };
    aircraft: string;
}

@Injectable()
export class FlightsService {
    private flights: Flight[] = [];

    constructor() {
        this.generateMockFlights();
    }

    private generateMockFlights() {
        const countries = ['Turkey', 'USA', 'Germany', 'France', 'UK', 'Japan', 'China', 'Brazil', 'Canada', 'Australia'];
        const airlines = ['Turkish Airlines', 'Delta', 'Lufthansa', 'Air France', 'British Airways', 'ANA', 'Air China', 'LATAM', 'Air Canada', 'Qantas'];
        const aircrafts = ['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A380', 'Boeing 787', 'Airbus A350'];

        // Simulate 500 flights for demo
        for (let i = 1; i <= 500; i++) {
            const depCountry = countries[Math.floor(Math.random() * countries.length)];
            let arrCountry = countries[Math.floor(Math.random() * countries.length)];
            while (arrCountry === depCountry) {
                arrCountry = countries[Math.floor(Math.random() * countries.length)];
            }

            this.flights.push({
                id: i,
                airline: airlines[Math.floor(Math.random() * airlines.length)],
                flightNumber: 'TK' + (1000 + i),
                status: ['Scheduled', 'Delayed', 'Boarding', 'Cancelled'][Math.floor(Math.random() * 4)],
                departure: {
                    airport: depCountry + ' Airport',
                    country: depCountry,
                    scheduledTime: new Date(Date.now() + i * 60000).toISOString(),
                },
                arrival: {
                    airport: arrCountry + ' Airport',
                    country: arrCountry,
                    scheduledTime: new Date(Date.now() + i * 60000 + 7200000).toISOString(),
                },
                aircraft: aircrafts[Math.floor(Math.random() * aircrafts.length)],
            });
        }
    }

    getDepartures() {
        return this.flights.map(f => ({
            flightNumber: f.flightNumber,
            airline: f.airline,
            status: f.status,
            departure: f.departure,
            arrival: f.arrival,
            aircraft: f.aircraft,
        }));
    }

    getArrivals() {
        return this.flights.map(f => ({
            flightNumber: f.flightNumber,
            airline: f.airline,
            status: f.status,
            departure: f.departure,
            arrival: f.arrival,
            aircraft: f.aircraft,
        }));
    }

    getAds() {
        return [
            { id: 1, text: 'Welcome to Airport', imageUrl: 'https://via.placeholder.com/728x90?text=Airport+Ad+1' },
            { id: 2, text: 'Travel Insurance', imageUrl: 'https://via.placeholder.com/728x90?text=Airport+Ad+2' },
        ];
    }

    // Simulate flight updates by randomly changing status every update
    updateFlightStatuses() {
        this.flights.forEach(flight => {
            if (Math.random() < 0.1) {
                const statuses = ['Scheduled', 'Delayed', 'Boarding', 'Cancelled'];
                flight.status = statuses[Math.floor(Math.random() * statuses.length)];
            }
        });
    }
}
