import { IMessageDataSource } from './IMessageDataSource';
import { Message } from '../../shared/models/Message';

export class LocalMessageDataSource implements IMessageDataSource {
  private messages: Message[] = [];

  constructor(initialMessages: Message[] = []) {
    this.messages = initialMessages;
  }

  async fetchMessages(): Promise<Message[]> {
    return [...this.messages];
  }

  async saveMessage(message: Message): Promise<void> {
    this.messages.push(message);
    this.messages.sort((a, b) => a.order - b.order);
  }

  async updateMessage(id: string, message: Message): Promise<void> {
    const index = this.messages.findIndex((m) => m.id === id);
    if (index !== -1) {
      this.messages[index] = { ...message, updatedAt: new Date().toISOString() };
    }
  }

  async deleteMessage(id: string): Promise<void> {
    this.messages = this.messages.filter((m) => m.id !== id);
  }

  setMessages(messages: Message[]): void {
    this.messages = messages;
  }
}
