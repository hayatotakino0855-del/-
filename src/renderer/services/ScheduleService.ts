import { Schedule, Message } from '../../shared/models/Message';

export class ScheduleService {
  isMessageActiveNow(schedule: Schedule): boolean {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    switch (schedule.type) {
      case 'always':
        return true;

      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5;

      case 'weekend':
        return dayOfWeek === 0 || dayOfWeek === 6;

      case 'custom':
        if (schedule.daysOfWeek && !schedule.daysOfWeek.includes(dayOfWeek)) {
          return false;
        }

        if (schedule.timeRanges && schedule.timeRanges.length > 0) {
          return schedule.timeRanges.some((range) => {
            return currentTime >= range.startTime && currentTime <= range.endTime;
          });
        }

        return true;

      default:
        return false;
    }
  }

  filterActiveMessages(messages: Message[]): Message[] {
    return messages
      .filter((message) => message.enabled && this.isMessageActiveNow(message.schedule))
      .sort((a, b) => a.order - b.order);
  }
}
