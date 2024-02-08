import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { add, format, formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Share } from "@/components/share";

import { ClockIcon } from "lucide-react";
import type { ServerGuild, ScheduledEvent } from "@discron/shared";


interface CalendarItemProps {
    server: ServerGuild;
    event: ScheduledEvent;
}

function getStatus(event: ScheduledEvent) {
    if (!event.startsAt) {
        return "Past";
    }

    const endAt = event?.endsAt || add(event.startsAt, { hours: 1 });
    const isPast = endAt < new Date();

    if (isPast) {
        return "Past";
    }

    const isOngoing = event.startsAt < new Date() && endAt > new Date();

    if (isOngoing) {
        return "Ongoing";
    }

    return "Upcoming";
}

const formattedStatus = {
    "Past": "Already ended :(",
    "Ongoing": "Happening right now!",
    "Upcoming": "Coming soon!",
} as const;

const getFriendlyStatus = (event: ScheduledEvent, status: ReturnType<typeof getStatus>) => {
    switch (status) {
        case "Past":
            return "Already ended :(";
        case "Ongoing":
            return "Happening right now!";
        case "Upcoming":
            return (
                <>
                    <span className="font-bold">Starts in</span> {formatDistance(event.startsAt ?? new Date(), new Date(), { locale: ptBR })}
                </>
            );
    }
}

const emojis = {
    "Past": "😕",
    "Ongoing": "🔥",
    "Upcoming": "👀"
} as const;

export function CalendarItem({ server, event }: CalendarItemProps) {
    const status = getStatus(event);

    const backgroundImage = event.image ?? server.banner ?? server.splash ?? server.icon;

    return (
        <Card className={cn("group relative flex flex-col gap-2 w-full h-full p-4")}>
            <div>
                    <span className="text-sm">
                        {getFriendlyStatus(event, status)}
                    </span>
            </div>
            <CardHeader className="relative text-accent h-32">
                <div className="absolute top-0 left-0 h-full w-full rounded-lg overflow-hidden">
                    {backgroundImage && (
                        <img
                            src={backgroundImage}
                            alt={server.name}
                            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-300"
                        />
                    )}
                    <div
                        className="absolute top-0 left-0 h-full w-full bg-black bg-opacity-60 rounded-t-lg overflow-hidden"
                    />
                </div>
                <CardTitle className="z-10">
                    {emojis[status]} {event.name}
                </CardTitle>
                <CardDescription className="z-10 text-accent">
                    {event.description?.slice(0, 100)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-2 py-4">
                <p><span className="font-bold">Created by: </span>{event.creator?.name}</p>
                {event.startsAt && (
                    <p><span className="font-bold">Start: </span> {format(event.startsAt, "PPpp", { locale: ptBR })}</p>
                )}
                {event.endsAt && (
                    <p>
                        <span className="font-bold">Ends: </span> {format(event.endsAt ?? new Date(), "PPpp", { locale: ptBR })}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-6">
                <div className="flex items-center gap-2 w-full">
                    {
                        event.creator.image &&
                        <img src={event.creator.image} alt={server.name} className="h-10 w-10 rounded-full" />
                    }
                    <p className="text-sm">
                        <span className="font-bold">{event.creator.name}</span> is hosting this event
                    </p>
                </div>
                <div className="flex gap-2">
                    <Share server={server} event={event} />
                    <Button variant="default">Join Event</Button>
                    <span className="absolute bottom-2 right-2">
                        Others {event.subscribers} are going!
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}
