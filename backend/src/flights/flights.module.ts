import { Module } from '@nestjs/common';
import { FlightsService } from './flights.service';
import { FlightController } from './flights.controller';
import { FlightGateway } from './flights.gateway';
import {AdsController} from "../ads/ads.controller";

@Module({
    controllers: [FlightController,AdsController],
    providers: [FlightsService, FlightGateway],
    exports: [FlightsService],
})
export class FlightsModule {}
