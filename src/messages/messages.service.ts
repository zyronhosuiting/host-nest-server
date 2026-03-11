import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import { CreateConversationDto, SendMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Conversation)
    private readonly convRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly msgRepo: Repository<Message>,
  ) {}

  // ─── Conversations ───────────────────────────────────

  /**
   * List all conversations for a user, with the latest message preview.
   */
  async getConversations(userId: number) {
    const conversations = await this.convRepo.find({
      where: { userId },
      order: { updatedAt: 'DESC' },
    });

    // Attach last message to each conversation
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await this.msgRepo.findOne({
          where: { conversationId: conv.id },
          order: { createdAt: 'DESC' },
        });
        return {
          ...conv,
          lastMessage: lastMessage
            ? {
                text: lastMessage.text,
                createdAt: lastMessage.createdAt,
                senderId: lastMessage.senderId,
              }
            : null,
        };
      }),
    );

    return result;
  }

  /**
   * Create a new conversation for the current user.
   */
  async createConversation(
    userId: number,
    dto: CreateConversationDto,
  ): Promise<Conversation> {
    const conv = this.convRepo.create({
      userId,
      participantName: dto.participantName,
      property: dto.property,
      listingId: dto.listingId,
      avatar: dto.avatar ?? '',
    });
    return this.convRepo.save(conv);
  }

  /**
   * Get a conversation with ownership check.
   */
  async getConversation(
    conversationId: number,
    userId: number,
  ): Promise<Conversation> {
    const conv = await this.convRepo.findOne({
      where: { id: conversationId },
    });
    if (!conv) {
      throw new NotFoundException('找不到此對話');
    }
    if (conv.userId !== userId) {
      throw new ForbiddenException('無權存取此對話');
    }
    return conv;
  }

  /**
   * Delete a conversation (and cascade messages).
   */
  async deleteConversation(
    conversationId: number,
    userId: number,
  ): Promise<void> {
    const conv = await this.getConversation(conversationId, userId);
    await this.convRepo.remove(conv);
  }

  // ─── Messages ────────────────────────────────────────

  /**
   * Get all messages for a conversation (with ownership check).
   */
  async getMessages(conversationId: number, userId: number): Promise<Message[]> {
    await this.getConversation(conversationId, userId); // ownership check
    return this.msgRepo.find({
      where: { conversationId },
      order: { createdAt: 'ASC' },
    });
  }

  /**
   * Send a message in a conversation.
   */
  async sendMessage(
    conversationId: number,
    senderId: number,
    dto: SendMessageDto,
  ): Promise<Message> {
    await this.getConversation(conversationId, senderId); // ownership check

    const msg = this.msgRepo.create({
      conversationId,
      senderId,
      text: dto.text,
      imageUrl: dto.imageUrl,
    });
    const saved = await this.msgRepo.save(msg);

    // Update conversation's updatedAt
    await this.convRepo.update(conversationId, {});

    return saved;
  }
}
