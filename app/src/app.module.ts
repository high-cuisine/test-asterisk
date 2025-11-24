import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallSimulatorModule } from './call-simulator/call-simulator.module';
import { ProccesorModule } from './proccesor/proccesor.module';
import { CrmModule } from './crm/crm.module';
import { AsteriskModule } from './asterisk/asterisk.module';

@Module({
  imports: [CrmModule, ProccesorModule, AsteriskModule, CallSimulatorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
