export interface QueuedEvent {
  id: string;
  timestamp: number;
  type: 'WARNING' | 'RED' | 'PING';
  data: any;
}

class OfflineSyncService {
  private queue: QueuedEvent[] = [];
  private isOnline: boolean = true;
  private apiBaseUrl: string = 'http://localhost:3001/api';

  constructor() {
    console.log('[OfflineSync] Service initialized');
  }

  public setOnlineStatus(online: boolean) {
    this.isOnline = online;
    if (online && this.queue.length > 0) {
      this.flushQueue();
    }
  }

  public getOnlineStatus() {
    return this.isOnline;
  }

  public async queueEvent(type: 'WARNING' | 'RED' | 'PING', data: any) {
    const event: QueuedEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
      type,
      data
    };

    if (!this.isOnline) {
      this.queue.push(event);
      console.log(`[OfflineSync] Queued offline event (${type}). Total queued: ${this.queue.length}`);
      return { status: 'QUEUED_OFFLINE', event };
    }

    try {
      const res = await fetch(`${this.apiBaseUrl}/safety/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      return { status: 'SENT_ONLINE', result: json };
    } catch (err) {
      this.queue.push(event);
      this.isOnline = false;
      console.log(`[OfflineSync] Network request failed. Queued event (${type}).`);
      return { status: 'QUEUED_OFFLINE', event };
    }
  }

  public async flushQueue() {
    console.log(`[OfflineSync] Flushing ${this.queue.length} offline events...`);
    const eventsToFlush = [...this.queue];
    this.queue = [];

    for (const item of eventsToFlush) {
      try {
        await fetch(`${this.apiBaseUrl}/safety/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });
      } catch (err) {
        // re-queue if failed
        this.queue.push(item);
      }
    }
  }

  public getQueueLength() {
    return this.queue.length;
  }
}

export const offlineSync = new OfflineSyncService();
