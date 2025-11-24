import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as AsteriskManager from 'asterisk-manager';

export interface OriginatePayload {
  caller: string;
  callee: string;
  context?: string;
  extension?: string;
  callerId?: string;
  timeout?: number;
  payload?: Record<string, string>;
}

@Injectable()
export class AsteriskService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AsteriskService.name);
  private manager?: any;

  onModuleInit(): void {
    const host = process.env.ASTERISK_AMI_HOST;
    const username = process.env.ASTERISK_AMI_USER;
    const password = process.env.ASTERISK_AMI_SECRET;

    if (!host || !username || !password) {
      this.logger.warn('Asterisk AMI credentials are not provided. Simulation will run in mock mode.');
      return;
    }

    const port = Number(process.env.ASTERISK_AMI_PORT ?? 5038);
    this.manager = new (AsteriskManager as any)(
      port,
      host,
      username,
      password,
      true,
    );

    this.manager.keepConnected();
    this.manager.on('ready', () => this.logger.log('Connected to Asterisk AMI'));
    this.manager.on('error', (error: Error) => this.logger.error('AMI error', error.stack));
  }

  onModuleDestroy(): void {
    if (this.manager) {
      this.manager.disconnect();
    }
  }

  async originateCall(payload: OriginatePayload): Promise<{ status: string; detail: any }> {
    if (!this.manager) {
      this.logger.warn('Returning mock originate result (AMI disabled)');
      return {
        status: 'mock',
        detail: {
          message: 'AMI not configured. Call simulated locally.',
          caller: payload.caller,
          callee: payload.callee,
        },
      };
    }

    const action = {
      action: 'Originate',
      channel: `SIP/${payload.callee}`,
      context: payload.context ?? 'internal',
      exten: payload.extension ?? payload.callee,
      priority: 1,
      callerid: payload.callerId ?? payload.caller,
      timeout: payload.timeout ?? 30000,
      variable: {
        SIMULATION_PAYLOAD: JSON.stringify(payload.payload ?? {}),
      },
    };

    return new Promise((resolve, reject) => {
      this.manager.action(action, (err: Error, res: any) => {
        if (err) {
          this.logger.error('Originate action failed', err.stack);
          return reject(err);
        }

        resolve({
          status: res?.Response ?? 'Unknown',
          detail: res,
        });
      });
    });
  }
}


