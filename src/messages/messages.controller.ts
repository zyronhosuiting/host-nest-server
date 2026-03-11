import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateConversationDto, SendMessageDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../entities/user.entity';

@UseGuards(JwtAuthGuard)
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  // ─── Conversations ───────────────────────────────────

  /**
   * GET /api/messages/conversations — list conversations with last message
   */
  @Get('conversations')
  getConversations(@CurrentUser() user: User) {
    return this.messagesService.getConversations(user.id);
  }

  /**
   * POST /api/messages/conversations — create a new conversation
   */
  @Post('conversations')
  createConversation(
    @CurrentUser() user: User,
    @Body() dto: CreateConversationDto,
  ) {
    return this.messagesService.createConversation(user.id, dto);
  }

  /**
   * DELETE /api/messages/conversations/:id — delete a conversation
   */
  @Delete('conversations/:id')
  deleteConversation(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.messagesService.deleteConversation(id, user.id);
  }

  // ─── Messages ────────────────────────────────────────

  /**
   * GET /api/messages/conversations/:id/messages — get messages in a conversation
   */
  @Get('conversations/:id/messages')
  getMessages(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.messagesService.getMessages(id, user.id);
  }

  /**
   * POST /api/messages/conversations/:id/messages — send a message
   */
  @Post('conversations/:id/messages')
  sendMessage(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(id, user.id, dto);
  }
}
