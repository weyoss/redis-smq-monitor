import { IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExchangeResponseBodyDTO {
  @IsString({ each: true })
  data!: string[];
}

export class CreateExchangeResponseDTO {
  @IsInt()
  status!: number;

  @ValidateNested()
  @Type(() => CreateExchangeResponseBodyDTO)
  body!: CreateExchangeResponseBodyDTO;
}
