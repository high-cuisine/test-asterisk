import { IsOptional, IsString, Length } from 'class-validator';

export class SimulateCallDto {
  @IsString()
  @Length(3, 32)
  caller!: string;

  @IsString()
  @Length(3, 32)
  callee!: string;

  @IsString()
  userMessage!: string;

  @IsOptional()
  @IsString()
  scenario?: string;
}


