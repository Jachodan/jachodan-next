"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
    isPin: boolean;
    onToggle: () => void;
    className?: string;
    size?: number;
}

export default function FavoriteButton({ isPin, onToggle, className, size = 16 }: FavoriteButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onToggle();
            }}
            className={cn("transition-all hover:scale-110", className)}
            aria-label={isPin ? "즐겨찾기 해제" : "즐겨찾기 추가"}
        >
            <Star
                size={size}
                className={cn("transition-colors", isPin ? "fill-yellow-400 stroke-yellow-400" : "stroke-gray-400")}
            />
        </button>
    );
}
