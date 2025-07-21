import { Controller, Get } from '@nestjs/common';
import { FlightsService } from './flights.service';

@Controller('api')
export class FlightController {
    constructor(private readonly flightService: FlightsService) {}

    @Get('departures')
    getDepartures() {
        return this.flightService.getDepartures();
    }

    @Get('arrivals')
    getArrivals() {
        return this.flightService.getArrivals();
    }

    @Get('ads')
    getAds() {
        return this.flightService.getAds();
    }
}
