export interface ServerInfo {
    id: string;
    name: string;
    invite: string;
}

export interface ScheduledEvent {
    id: string;
    name: string;
    description: string;
    creator: string;
    location?: string;
    startAt: Date;
    endAt?: Date;
}
