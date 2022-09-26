import { IsNotEmpty, IsString } from 'class-validator';

export class GetExchangeQueuesRequestDTO {
  @IsString()
  @IsNotEmpty()
  exchangeName!: string;
}
