import { CalendarItem } from "@/components/calendar/calendar-item";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Background } from "@/components/background";
import { kil } from "@/lib/db";
import { scheduledEvents, guilds } from "@discron/shared";
import { eq, or } from "drizzle-orm";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const [serverInfo] = await kil.select().from(guilds).where(or(eq(guilds.id, params.id), eq(guilds.shortUrl, params.id)));

    if (!serverInfo) {
        console.error("Server not found");
        return {
            title: "Discron",
            description: "Discron is a Discord bot that helps you share your server events.",
        }
    }

    return {
        title: `Discron | ${serverInfo.name}`,
        description: `Upcoming events in ${serverInfo.name}`,
        openGraph: {
            images: [serverInfo.icon!]
        },
        twitter: {

        }
    }
}

export default async function GuildPage(
    { params }: { params: { id: string } }
) {

    if (!params?.id) {
        console.error("No server id provided");
        return null;
    }

    const [serverInfo] = await kil.select().from(guilds).where(or(eq(guilds.id, params.id), eq(guilds.shortUrl, params.id)));
    const events = await kil.select().from(scheduledEvents).where(eq(scheduledEvents.guildId, serverInfo.id));

    if (!serverInfo) {
        console.error("Server not found");
        return;
    }

    return (
        <main
            className={cn(
                "relative flex flex-col justify-center items-center min-h-screen w-full overflow-hidden gap-6 p-8",
            )}
        >
            <Background />
            <Button
                variant="link"
                className="hidden sm:inline-flex absolute top-5 left-3 p-4 text-4xl font-bold text-white after:bg-white"
            >
                Discron
            </Button>
            <div className="flex flex-col items-center justify-center gap-6">
                {
                    serverInfo.icon && (
                        <img
                            src={serverInfo.icon}
                            alt={serverInfo.name}
                            className="h-64 rounded-full"
                        >
                        </img>
                    )
                }
                <Button
                    variant="ghost"
                    className="text-4xl font-bold break-words text-pretty text-accent"
                >
                    Upcoming Events in {serverInfo.name}
                </Button>
            </div>
            <div className="relative grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="absolute inset-x-0 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-2/4 blur-sm" />
                <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
                {events.map((event) => (
                    <CalendarItem
                        key={event.id}
                        event={event}
                        server={serverInfo}
                    />
                ))}
            </div>
        </main>
    );
}
