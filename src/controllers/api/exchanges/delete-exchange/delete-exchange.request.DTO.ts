import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteExchangeRequestDTO {
  @IsString()
  @IsNotEmpty()
  exchangeName!: string;
}
