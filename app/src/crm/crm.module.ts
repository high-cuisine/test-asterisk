import { Module } from '@nestjs/common';
import { ServicesService } from './services/services.service';
import { DoctorService } from './services/doctor.service';

@Module({
  providers: [ServicesService, DoctorService],
  exports: [ServicesService, DoctorService],
})
export class CrmModule {}


