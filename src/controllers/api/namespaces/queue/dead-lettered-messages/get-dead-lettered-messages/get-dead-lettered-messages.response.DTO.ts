import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GetMessagesResponseBodyDTO } from '../../../../../../common/dto/queues/get-messages-response-body.DTO';

export class GetDeadLetteredMessagesResponseDTO {
  @IsInt()
  status!: number;

  @ValidateNested()
  @Type(() => GetMessagesResponseBodyDTO)
  body!: GetMessagesResponseBodyDTO;
}
