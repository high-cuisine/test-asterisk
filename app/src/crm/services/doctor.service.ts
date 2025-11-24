import { Injectable } from '@nestjs/common';

interface DoctorPosition {
  id: string;
  name: string;
  specialization: string;
  experience: number;
}

@Injectable()
export class DoctorService {
  private readonly doctors: DoctorPosition[] = [
    {
      id: 'd-1001',
      name: 'Ирина Соколова',
      specialization: 'Кардиолог',
      experience: 12,
    },
    {
      id: 'd-1002',
      name: 'Михаил Романов',
      specialization: 'Невролог',
      experience: 8,
    },
    {
      id: 'd-1003',
      name: 'Анна Кузнецова',
      specialization: 'Педиатр',
      experience: 6,
    },
  ];

  async getDoctors(): Promise<{ data: { userPosition: DoctorPosition[] } }> {
    return { data: { userPosition: this.doctors } };
  }
}


