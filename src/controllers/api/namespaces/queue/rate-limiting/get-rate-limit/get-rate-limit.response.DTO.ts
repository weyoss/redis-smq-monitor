import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QueueSettingsRateLimitDTO } from '../../../../../../common/dto/queues/queue-settings-rate-limit.DTO';

export class GetRateLimitResponseBodyDTO {
  @ValidateNested()
  @Type(() => QueueSettingsRateLimitDTO)
  @IsOptional()
  data?: QueueSettingsRateLimitDTO | null = null;
}

export class GetRateLimitResponseDTO {
  @IsInt()
  status!: number;

  @ValidateNested()
  @Type(() => GetRateLimitResponseBodyDTO)
  body!: GetRateLimitResponseBodyDTO;
}
