import { IMessageDataSource } from './IMessageDataSource';
import { Message } from '../../shared/models/Message';
import { ScheduleService } from './ScheduleService';

export class MessageService {
  private dataSource: IMessageDataSource;
  private scheduleService: ScheduleService;

  constructor(dataSource: IMessageDataSource, scheduleService: ScheduleService) {
    this.dataSource = dataSource;
    this.scheduleService = scheduleService;
  }

  async getAllMessages(): Promise<Message[]> {
    return this.dataSource.fetchMessages();
  }

  async getActiveMessages(): Promise<Message[]> {
    const messages = await this.dataSource.fetchMessages();
    return this.scheduleService.filterActiveMessages(messages);
  }

  async createMessage(message: Message): Promise<void> {
    await this.dataSource.saveMessage(message);
  }

  async updateMessage(id: string, message: Message): Promise<void> {
    await this.dataSource.updateMessage(id, message);
  }

  async deleteMessage(id: string): Promise<void> {
    await this.dataSource.deleteMessage(id);
  }

  async reorderMessages(messages: Message[]): Promise<void> {
    for (let i = 0; i < messages.length; i++) {
      messages[i].order = i + 1;
      await this.dataSource.updateMessage(messages[i].id, messages[i]);
    }
  }
}
