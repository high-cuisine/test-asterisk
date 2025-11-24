import { Injectable } from '@nestjs/common';

@Injectable()
export class ServicesService {
  private readonly mockServices = [
    'Первичный прием терапевта',
    'Запись к врачу-кардиологу',
    'Онлайн консультация педиатра',
    'Повторный прием стоматолога',
  ];

  async getServices(): Promise<string[]> {
    return this.mockServices;
  }
}


