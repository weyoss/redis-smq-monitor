import { IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class GetExchangesResponseBodyDTO {
  @IsString({ each: true })
  data!: string[];
}

export class GetExchangesResponseDTO {
  @IsInt()
  status!: number;

  @ValidateNested()
  @Type(() => GetExchangesResponseBodyDTO)
  body!: GetExchangesResponseBodyDTO;
}
