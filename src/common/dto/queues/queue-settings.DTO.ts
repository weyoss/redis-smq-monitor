import { EQueueType, TQueueSettings } from 'redis-smq/dist/types';
import {
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { QueueSettingsRateLimitDTO } from './queue-settings-rate-limit.DTO';
import { Type } from 'class-transformer';

export class QueueSettingsDTO implements TQueueSettings {
  @IsBoolean()
  priorityQueuing!: boolean;

  @IsEnum(EQueueType)
  type!: number;

  @ValidateNested()
  @Type(() => QueueSettingsRateLimitDTO)
  @IsOptional()
  rateLimit: QueueSettingsRateLimitDTO | null = null;

  @IsString()
  @IsOptional()
  exchange: string | null = null;
}
