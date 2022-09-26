import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExchangeRequestDTO {
  @IsString()
  @IsNotEmpty()
  exchangeName!: string;
}
