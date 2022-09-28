import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { MessageQueueDTO } from '../../../../common/dto/queues/message-queue.DTO';
import { QueueSettingsDTO } from '../../../../common/dto/queues/queue-settings.DTO';

export class CreateQueueResponseBodyDataDTO {
  @ValidateNested()
  @Type(() => MessageQueueDTO)
  queue!: MessageQueueDTO;

  @ValidateNested()
  @Type(() => QueueSettingsDTO)
  settings!: QueueSettingsDTO;
}

export class CreateQueueResponseBodyDTO {
  @ValidateNested()
  @Type(() => CreateQueueResponseBodyDataDTO)
  data!: CreateQueueResponseBodyDataDTO;
}

export class CreateQueueResponseDTO {
  @IsInt()
  status!: number;

  @ValidateNested()
  @Type(() => CreateQueueResponseBodyDTO)
  body!: CreateQueueResponseBodyDTO;
}
