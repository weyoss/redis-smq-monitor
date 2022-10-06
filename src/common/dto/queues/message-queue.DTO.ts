import { TQueueParams } from 'redis-smq/dist/types';
import { IsNotEmpty, IsString } from 'class-validator';

export class MessageQueueDTO implements TQueueParams {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  ns!: string;
}
