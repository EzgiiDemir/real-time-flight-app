import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlightsModule } from './flights/flights.module';
import { AdsModule } from './ads/ads.module';
@Module({
  imports: [FlightsModule, AdsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
