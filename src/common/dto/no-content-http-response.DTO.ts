import { Equals, IsInt } from 'class-validator';
import { TResponseDTO } from '../routing';

export class NoContentHttpResponseDTO implements TResponseDTO {
  @IsInt()
  status!: number;

  @Equals(undefined)
  body: void = undefined;
}
