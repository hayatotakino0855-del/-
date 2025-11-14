import { Message } from '../../shared/models/Message';

export interface IMessageDataSource {
  fetchMessages(): Promise<Message[]>;
  saveMessage(message: Message): Promise<void>;
  updateMessage(id: string, message: Message): Promise<void>;
  deleteMessage(id: string): Promise<void>;
}
