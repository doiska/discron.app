import {type GuildScheduledEvent, GuildScheduledEventPrivacyLevel, GuildScheduledEventStatus} from "discord.js";

export function getEventCreator(event: GuildScheduledEvent) {
    if(event.creator) {
        return {
            id: event.creator.id,
            name: event.creator.globalName,
            avatar: event.creator.avatarURL(),
            type: "user"
        }
    }

    if(event.guild) {
        return {
            id: event.guild.id,
            name: event.guild.name,
            avatar: event.guild.iconURL(),
            type: "guild"
        }
    }

    return null;
}

export function getPrivacyLevel(event: GuildScheduledEvent) {
    if(event.privacyLevel === GuildScheduledEventPrivacyLevel.GuildOnly) {
        return "guild-only";
    }

    return "public";
}

export function getStatus(event: GuildScheduledEvent) {
    const statuses = {
        [GuildScheduledEventStatus.Scheduled]: "scheduled",
        [GuildScheduledEventStatus.Active]: "active",
        [GuildScheduledEventStatus.Canceled]: "cancelled",
        [GuildScheduledEventStatus.Completed]: "completed",
    } as const;

    return statuses[event.status] || "unknown";
}


export function parseScheduledEvent(event: GuildScheduledEvent) {
    return {
        id: event.id,
        name: event.name,
        description: event.description,
        url: event.url,
        access: getPrivacyLevel(event) === "public",
        status: getStatus(event),
        channel: event.channel,
        creator: getEventCreator(event),
        subscribers: {
            count: event.userCount,
            subscribers: null,
        },
        image: event.image,
        location: event.entityMetadata?.location,
        createdAt: event.createdAt,
    }
}

export async function getEventSubscribers(event: GuildScheduledEvent) {
    const subscribers = await event.fetchSubscribers();

    return subscribers.map(({ user }) => ({
        id: user.id,
        name: user.displayName,
        avatar: user.avatarURL(),
    }))
}
