import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class QueueSettingsRateLimitDTO {
  @IsNumber()
  @Type(() => Number)
  interval!: number;

  @IsNumber()
  @Type(() => Number)
  limit!: number;
}
