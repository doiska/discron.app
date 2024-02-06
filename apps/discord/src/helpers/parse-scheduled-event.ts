import { type GuildScheduledEvent, GuildScheduledEventPrivacyLevel, GuildScheduledEventStatus } from "discord.js";

export function getEventCreator(event: GuildScheduledEvent) {
    if (event.creator) {
        return {
            id: event.creator.id,
            name: event.creator.displayName,
            image: event.creator.avatarURL(),
            type: "user"
        }
    }

    if (event.guild) {
        return {
            id: event.guild.id,
            name: event.guild.name,
            image: event.guild.iconURL(),
            type: "guild"
        }
    }
}

export function getPrivacyLevel(event: GuildScheduledEvent) {
    if (event.privacyLevel === GuildScheduledEventPrivacyLevel.GuildOnly) {
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
    const location = (() => {
        if (event.entityMetadata?.location) {
            return {
                id: event.entityMetadata?.location,
                name: event.entityMetadata?.location,
                type: "raw",
            }
        }

        if (event.channel) {
            return {
                id: event.channel.id,
                name: event.channel.name,
                type: "channel",
            }
        }

        return null;
    })();

    return {
        id: event.id,
        name: event.name,
        description: event.description,
        url: null,
        access: getPrivacyLevel(event) === "public",
        status: getStatus(event),
        creator: getEventCreator(event),
        image: event.coverImageURL({
            size: 4096,
        }),
        location: location,
        subscribers: {
            count: event.userCount,
            subscribers: null,
        },
        startsAt: event.scheduledStartAt,
        endsAt: event.scheduledEndAt,
        createdAt: event.createdAt,
    } as const;
}

export async function getEventSubscribers(event: GuildScheduledEvent) {
    const subscribers = await event.fetchSubscribers();

    return subscribers.map(({ user }) => ({
        id: user.id,
        name: user.displayName,
        avatar: user.avatarURL(),
    }))
}
