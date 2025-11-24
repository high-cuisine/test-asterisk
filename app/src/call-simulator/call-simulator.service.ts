import { Injectable, Logger } from '@nestjs/common';
import { ProccesorService } from 'src/proccesor/services/proccesor.service';
import { AsteriskService } from 'src/asterisk/asterisk.service';
import { SimulateCallDto } from './dto/simulate-call.dto';
import { ChatMsg } from 'src/proccesor/interface/chat.interface';

@Injectable()
export class CallSimulatorService {
  private readonly logger = new Logger(CallSimulatorService.name);

  constructor(
    private readonly proccesorService: ProccesorService,
    private readonly asteriskService: AsteriskService,
  ) {}

  async simulateCall(dto: SimulateCallDto) {
    const script: ChatMsg[] = [
      {
        role: 'user',
        content: dto.userMessage,
      },
    ];

    const aiResponse = await this.safeAskAi(script);
    const originateResult = await this.safeOriginate(dto);

    return {
      caller: dto.caller,
      callee: dto.callee,
      scenario: dto.scenario ?? 'default',
      originateResult,
      aiResponse,
      transcript: [
        { from: dto.caller, text: dto.userMessage },
        { from: 'assistant', text: aiResponse.content },
      ],
    };
  }

  private async safeAskAi(script: ChatMsg[]) {
    try {
      return await this.proccesorService.sendMessage(script);
    } catch (error) {
      this.logger.warn(`OpenAI is unavailable: ${error}`);
      return {
        type: 'text',
        content: 'Сервис ИИ сейчас недоступен, ответ сгенерирован заглушкой.',
      };
    }
  }

  private async safeOriginate(dto: SimulateCallDto) {
    try {
      return await this.asteriskService.originateCall({
        caller: dto.caller,
        callee: dto.callee,
        callerId: dto.caller,
        payload: { aiScenario: dto.scenario ?? 'default' },
      });
    } catch (error) {
      this.logger.warn(`Asterisk originate failed: ${error}`);
      return { status: 'error', detail: error instanceof Error ? error.message : error };
    }
  }
}


