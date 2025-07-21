import { Controller, Get } from '@nestjs/common';

@Controller('api')
export class AdsController {
    @Get('ads')
    getAds() {
        return [
            { id: 1, message: '50% off all flights to Europe!' },
            { id: 2, message: 'Upgrade to Business Class now!' },
            { id: 3, message: 'Fly with comfort and safety!' },
        ];
    }
}