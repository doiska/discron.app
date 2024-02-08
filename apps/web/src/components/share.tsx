"use client"

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Copy, LucideExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServerGuild, ScheduledEvent } from "@discron/shared";
import { FaSquareXTwitter } from "react-icons/fa6";

interface ShareProps {
    server: ServerGuild;
    event: ScheduledEvent
}

export function Share({ server, event }: ShareProps) {

    const shareOnTwitter = () => {
        const tweet = `Join me on ${server.name} for ${event.name} ${server.shortUrl}`;
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Button variant="secondary" className="gap-4">
                    <LucideExternalLink />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Share on</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={shareOnTwitter}>
                    <FaSquareXTwitter className="w-6 h-6 mr-2" />
                    Twitter
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Copy className="w-6 h-6 mr-2 " />
                    Copy
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
