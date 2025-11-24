import { Body, Controller, Post } from '@nestjs/common';
import { CallSimulatorService } from './call-simulator.service';
import { SimulateCallDto } from './dto/simulate-call.dto';

@Controller('simulate-call')
export class CallSimulatorController {
  constructor(private readonly callSimulatorService: CallSimulatorService) {}

  @Post()
  simulate(@Body() dto: SimulateCallDto) {
    return this.callSimulatorService.simulateCall(dto);
  }
}


