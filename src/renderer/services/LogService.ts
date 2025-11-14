import { DisplayLog, ChangeLog, createDisplayLog, createChangeLog } from '../../shared/models/Log';

export class LogService {
  private displayLogs: DisplayLog[] = [];
  private changeLogs: ChangeLog[] = [];

  constructor(initialDisplayLogs: DisplayLog[] = [], initialChangeLogs: ChangeLog[] = []) {
    this.displayLogs = initialDisplayLogs;
    this.changeLogs = initialChangeLogs;
  }

  addDisplayLog(messageId: string, messageContent: string, startTime: string, endTime: string): void {
    const log = createDisplayLog(messageId, messageContent, startTime, endTime);
    this.displayLogs.push(log);
  }

  addChangeLog(
    action: ChangeLog['action'],
    target: ChangeLog['target'],
    details: any
  ): void {
    const log = createChangeLog(action, target, details);
    this.changeLogs.push(log);
  }

  getDisplayLogs(): DisplayLog[] {
    return [...this.displayLogs];
  }

  getChangeLogs(): ChangeLog[] {
    return [...this.changeLogs];
  }

  setDisplayLogs(logs: DisplayLog[]): void {
    this.displayLogs = logs;
  }

  setChangeLogs(logs: ChangeLog[]): void {
    this.changeLogs = logs;
  }
}
