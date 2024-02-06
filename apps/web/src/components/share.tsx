"use client"

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LucideExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScheduledEvent, ServerInfo } from "@/types";

interface ShareProps {
    server: ServerInfo;
    event: ScheduledEvent
}

export function Share({ server, event }: ShareProps) {

    const shareOnTwitter = () => {
        const tweet = `Join me on ${server.name} for ${event.name} ${server.invite}`;
        window.open(`https://twitter.com/intent/tweet?text=${tweet}`);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
                <Button variant="default" className="gap-4">
                    <LucideExternalLink />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Share on</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={shareOnTwitter}>X (Twitter)</DropdownMenuItem>
                <DropdownMenuItem>Copy</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
