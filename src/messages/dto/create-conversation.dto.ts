import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateConversationDto {
  @IsString()
  participantName: string;

  @IsString()
  property: string;

  @IsOptional()
  @IsNumber()
  listingId?: number;

  @IsOptional()
  @IsString()
  avatar?: string;
}
