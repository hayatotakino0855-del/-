export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface Schedule {
  type: 'always' | 'weekdays' | 'weekend' | 'custom';
  daysOfWeek?: number[];
  timeRanges?: TimeRange[];
}

export interface Message {
  id: string;
  content: string;
  order: number;
  enabled: boolean;
  schedule: Schedule;
  createdAt: string;
  updatedAt: string;
}

export function createDefaultSchedule(): Schedule {
  return {
    type: 'always',
  };
}

export function createDefaultMessage(order: number): Message {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    content: '',
    order,
    enabled: true,
    schedule: createDefaultSchedule(),
    createdAt: now,
    updatedAt: now,
  };
}
