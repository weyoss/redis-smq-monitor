import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MessageQueueDTO } from '../../../../common/dto/queues/message-queue.DTO';
import { Type } from 'class-transformer';

export class UnbindQueueRequestDTO {
  @IsString()
  @IsNotEmpty()
  exchangeName!: string;

  @ValidateNested()
  @Type(() => MessageQueueDTO)
  queue!: MessageQueueDTO;
}
