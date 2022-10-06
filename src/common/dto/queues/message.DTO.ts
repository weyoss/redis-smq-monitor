import {
  Allow,
  Equals,
  IsBoolean,
  IsDefined,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EExchangeType,
  IDirectExchangeParams,
  IFanOutExchangeParams,
  ITopicExchangeParams,
  TMessageJSON,
  TMessageState,
  TTopicParams,
} from 'redis-smq/dist/types';
import { MessageQueueValidator } from '../../validators/message-queue.validator';
import { MessageTopicExchangeValidator } from '../../validators/message-topic-exchange.validator';
import { MessageQueueDTO } from './message-queue.DTO';

export class MessageStateDTO implements TMessageState {
  @IsUUID('4')
  uuid!: string;

  @IsInt()
  @IsOptional()
  publishedAt: number | null = null;

  @IsInt()
  @IsOptional()
  scheduledAt: number | null = null;

  @IsBoolean()
  scheduledCronFired!: boolean;

  @IsInt()
  scheduledRepeatCount!: number;

  @IsInt()
  attempts!: number;

  @IsInt()
  nextScheduledDelay!: number;

  @IsInt()
  nextRetryDelay!: number;

  @IsBoolean()
  expired!: boolean;
}

export class MessageTopicExchangeBindingParamsDTO implements TTopicParams {
  @IsString()
  @IsNotEmpty()
  topic!: string;

  @IsString()
  @IsNotEmpty()
  ns!: string;
}

export class MessageTopicExchangeDTO implements ITopicExchangeParams {
  @Equals(EExchangeType.TOPIC)
  type!: EExchangeType.TOPIC;

  @ValidateNested()
  @Type(() => MessageQueueDTO)
  @IsOptional()
  destinationQueue: MessageQueueDTO | null = null;

  @IsDefined()
  @Validate(MessageTopicExchangeValidator)
  bindingParams!: MessageTopicExchangeBindingParamsDTO | string;

  @IsString()
  @IsNotEmpty()
  exchangeTag!: string;
}

export class MessageFanOutExchangeDTO implements IFanOutExchangeParams {
  @Equals(EExchangeType.FANOUT)
  type!: EExchangeType.FANOUT;

  @ValidateNested()
  @Type(() => MessageQueueDTO)
  @IsOptional()
  destinationQueue: MessageQueueDTO | null = null;

  @IsString()
  @IsNotEmpty()
  bindingParams!: string;

  @IsString()
  @IsNotEmpty()
  exchangeTag!: string;
}

export class MessageDirectExchangeDTO implements IDirectExchangeParams {
  @Equals(EExchangeType.DIRECT)
  type!: EExchangeType.DIRECT;

  @ValidateNested()
  @Type(() => MessageQueueDTO)
  @IsOptional()
  destinationQueue: MessageQueueDTO | null = null;

  @IsDefined()
  @Validate(MessageQueueValidator)
  bindingParams!: MessageQueueDTO | string;

  @IsString()
  @IsNotEmpty()
  exchangeTag!: string;
}

export class MessageDTO implements TMessageJSON {
  @IsInt()
  createdAt!: number;

  @IsInt()
  ttl!: number;

  @IsInt()
  retryThreshold!: number;

  @IsInt()
  retryDelay!: number;

  @IsInt()
  consumeTimeout!: number;

  @Allow()
  body: unknown = null;

  @IsString()
  @IsOptional()
  scheduledCron: string | null = null;

  @IsInt()
  @IsOptional()
  scheduledDelay: number | null = null;

  @IsInt()
  @IsOptional()
  scheduledRepeatPeriod: number | null = null;

  @IsInt()
  scheduledRepeat!: number;

  @IsInt()
  @IsOptional()
  priority: number | null = null;

  @Validate(MessageQueueValidator)
  @IsOptional()
  queue: MessageQueueDTO | string | null = null;

  @ValidateNested()
  @Type(() => MessageStateDTO)
  @IsOptional()
  messageState: MessageStateDTO | null = null;

  @ValidateNested()
  @Type((o) => {
    // type-coverage:ignore-next-line
    if (o && o.object.exchange) {
      // type-coverage:ignore-next-line
      const type: unknown = o.object.exchange.type;
      if (type === EExchangeType.FANOUT) return MessageFanOutExchangeDTO;
      if (type === EExchangeType.TOPIC) return MessageTopicExchangeDTO;
    }
    // default DTO
    return MessageDirectExchangeDTO;
  })
  @IsOptional()
  exchange:
    | MessageDirectExchangeDTO
    | MessageFanOutExchangeDTO
    | MessageTopicExchangeDTO
    | null = null;
}
