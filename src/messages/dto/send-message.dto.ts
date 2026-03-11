import { IsString, IsOptional } from 'class-validator';

export class SendMessageDto {
  @IsString()
  text: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
