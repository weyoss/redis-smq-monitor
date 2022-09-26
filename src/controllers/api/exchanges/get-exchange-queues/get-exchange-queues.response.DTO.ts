import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class GetExchangeQueuesBodyQueueDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  ns!: string;
}

export class GetExchangeQueuesBodyDTO {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GetExchangeQueuesBodyQueueDTO)
  data!: GetExchangeQueuesBodyQueueDTO[];
}

export class GetExchangeQueuesResponseDTO {
  @IsInt()
  status!: number;

  @ValidateNested()
  @Type(() => GetExchangeQueuesBodyDTO)
  body!: GetExchangeQueuesBodyDTO;
}
