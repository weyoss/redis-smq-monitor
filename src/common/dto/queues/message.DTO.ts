import {
  Allow,
  Equals,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
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
  TQueueParams,
  TTopicParams,
} from 'redis-smq/dist/types';

export class MessageQueueDTO implements TQueueParams {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  ns!: string;
}

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
  type!: number;

  @ValidateNested()
  @Type(() => MessageQueueDTO)
  @IsOptional()
  destinationQueue: MessageQueueDTO | null = null;

  @ValidateNested()
  @Type((o) =>
    typeof o?.object['bindingParams'] === 'string'
      ? String
      : MessageTopicExchangeBindingParamsDTO,
  )
  bindingParams!: MessageTopicExchangeBindingParamsDTO | string;

  @IsString()
  @IsNotEmpty()
  exchangeTag!: string;
}

export class MessageFanOutExchangeDTO implements IFanOutExchangeParams {
  @Equals(EExchangeType.FANOUT)
  type!: number;

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
  type!: number;

  @ValidateNested()
  @Type(() => MessageQueueDTO)
  @IsOptional()
  destinationQueue: MessageQueueDTO | null = null;

  @ValidateNested()
  @Type((o) =>
    typeof o?.object['bindingParams'] === 'string' ? String : MessageQueueDTO,
  )
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

  @ValidateNested()
  @Type((o) =>
    typeof o?.object['queue'] === 'string' ? String : MessageQueueDTO,
  )
  @IsOptional()
  queue: MessageQueueDTO | string | null = null;

  @ValidateNested()
  @Type(() => MessageStateDTO)
  @IsOptional()
  messageState: MessageStateDTO | null = null;

  @ValidateNested()
  @Type((o) => {
    if (o?.object['type'] === EExchangeType.FANOUT)
      return MessageFanOutExchangeDTO;
    if (o?.object['type'] === EExchangeType.TOPIC)
      return MessageTopicExchangeDTO;
    return MessageDirectExchangeDTO;
  })
  @IsOptional()
  exchange:
    | MessageDirectExchangeDTO
    | MessageFanOutExchangeDTO
    | MessageTopicExchangeDTO
    | null = null;
}
