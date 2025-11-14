export interface DisplayLog {
  id: string;
  messageId: string;
  messageContent: string;
  startTime: string;
  endTime: string;
}

export interface ChangeLog {
  id: string;
  timestamp: string;
  action: 'create' | 'update' | 'delete' | 'reorder' | 'settings_change';
  target: 'message' | 'schedule' | 'settings';
  details: string;
}

export function createDisplayLog(
  messageId: string,
  messageContent: string,
  startTime: string,
  endTime: string
): DisplayLog {
  return {
    id: crypto.randomUUID(),
    messageId,
    messageContent,
    startTime,
    endTime,
  };
}

export function createChangeLog(
  action: ChangeLog['action'],
  target: ChangeLog['target'],
  details: any
): ChangeLog {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    target,
    details: JSON.stringify(details),
  };
}
