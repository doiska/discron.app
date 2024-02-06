import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { add, format, formatDistance } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { Share } from "@/components/share";
import { ScheduledEvent, ServerInfo } from "@/types";
import { ClockIcon } from "lucide-react";

interface CalendarItemProps {
    server: ServerInfo;
    event: ScheduledEvent;
}

function getStatus(event: ScheduledEvent) {
    const endAt = event?.endAt || add(event.startAt, { hours: 1 });
    const isPast = endAt < new Date();

    if (isPast) {
        return "Past";
    }

    const isOngoing = event.startAt < new Date() && endAt > new Date();

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

const emojis = {
    "Past": "😕",
    "Ongoing": "🔥",
    "Upcoming": "👀"
} as const;

export function CalendarItem({ server, event }: CalendarItemProps) {
    const startAt = format(event.startAt, "PPpp", { locale: ptBR });
    const endsAt = format(event.endAt ?? new Date(), "PPpp", { locale: ptBR });

    const isCloseToStart = event.startAt < add(new Date(), { hours: 1 });

    const status = getStatus(event);

    return (
        <Card
            className={cn("group relative flex flex-col gap-2 p-4 max-w-[600px]")}
        >
            <CardHeader>
                <CardTitle className={cn(status === "Past" && "line-through group-hover:no-underline")}>
                    {status === "Upcoming" && <ClockIcon className="absolute top-2 right-0 w-6 h-6 inline-block mr-2" />}
                    {emojis[status]} {event.name}
                </CardTitle>
                <CardDescription>
                    {event.description.slice(0, 200)}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <p><span className="font-bold">Created by:</span> {event.creator}</p>
                <p><span className="font-bold">Start:</span> {startAt}</p>
                <p><span className="font-bold">Ends:</span> {endsAt}</p>
            </CardContent>
            <CardFooter className="flex justify-between ">
                <Button variant="outline">View Event</Button>
                <Share server={server} event={event} />
            </CardFooter>
        </Card>
    );
}
