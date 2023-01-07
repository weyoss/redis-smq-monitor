import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EQueueType } from 'redis-smq/dist/types';

export class SaveQueueRequestDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  ns: string | null = null;

  @IsEnum(EQueueType)
  type!: number;
}
