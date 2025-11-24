import { Module } from '@nestjs/common';
import { CallSimulatorController } from './call-simulator.controller';
import { CallSimulatorService } from './call-simulator.service';
import { ProccesorModule } from 'src/proccesor/proccesor.module';
import { AsteriskModule } from 'src/asterisk/asterisk.module';

@Module({
  imports: [ProccesorModule, AsteriskModule],
  controllers: [CallSimulatorController],
  providers: [CallSimulatorService],
})
export class CallSimulatorModule {}


