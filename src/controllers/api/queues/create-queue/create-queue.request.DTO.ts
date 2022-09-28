import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateQueueRequestDTO {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  ns: string | null = null;

  @IsBoolean()
  enablePriorityQueuing!: boolean;
}
