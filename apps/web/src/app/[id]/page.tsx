import { CalendarItem } from "@/components/calendar/calendar-item";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Background } from "@/components/background";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const mockEvents = [
    {
        id: "1",
        name: "Basement Meeting",
        description: "Reunião semanal para discutir o progresso do projeto.",
        startAt: new Date(),
        endAt: new Date(new Date().setHours(new Date().getHours() + 1)),
        location: "Discord - Meeting Stage",
        creator: "daniel reis"
    },
    {
        id: "2",
        name: "Game Night",
        description: "Vamos jogar Among Us!",
        startAt: new Date(new Date().setDate(new Date().getDate() + 1)),
        endAt: new Date(new Date().setDate(new Date().getDate() + 1)),
        location: "Discord",
        creator: "Event Creator",
    },
    {
        id: "3",
        name: "Conversa com o CEO",
        description: "Conversa com o CEO sobre o futuro da empresa.",
        startAt: new Date(new Date().setDate(new Date().getDate() - 3)),
        location: "Discord",
        creator: "Event Creator",
    }
]

const NAME = "Basement Devs";
const ICON = "https://cdn.discordapp.com/icons/694267688272396288/9978523b1197d3628ec64f0d9a3b6416.webp?size=512"
const BACKGROUND = "https://cdn.discordapp.com/splashes/452926217558163456/95459967dc65198f9105893d9f361808.jpg?size=2048"
const INVITE_LINK = "https://discord.gg/cw5kWWnx"

export default function GuildPage() {
    return (
        <main
            className={cn(
                "relative flex flex-col justify-center items-center min-h-screen w-full overflow-hidden",
            )}
        >
            <Background />
            <Button
                variant="link"
                className="hidden sm:inline-flex absolute top-5 left-3 p-4 text-4xl font-bold text-white after:bg-white"
            >
                Discron
            </Button>
            <div className="flex flex-col items-center justify-center space-y-6">
                <img
                    src={ICON}
                    alt="Basement Devs"
                    className="w-64 h-64 rounded-full"
                >
                </img>

                <Button
                    asChild={true}
                    variant="ghost"
                    className="text-4xl font-bold text-center break-words text-pretty text-accent"
                >
                    <Link href={INVITE_LINK}>
                        {NAME}
                    </Link>
                </Button>
                <div className="flex items-center justify-center w-full">
                    <Button
                        className="w-full"
                        variant="outline"
                    >
                        Join Server
                    </Button>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center space-y-6 mt-6 w-full">
                <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {mockEvents.map((event) => (
                        <CalendarItem
                            key={event.id}
                            event={event}
                            server={{
                                name: NAME,
                                id: "1",
                                invite: INVITE_LINK,
                            }}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
