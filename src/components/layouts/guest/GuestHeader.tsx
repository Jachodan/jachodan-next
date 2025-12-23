"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GuestHeader() {
    return (
        <header className="h-16 border-b bg-background">
            <div className="container h-full mx-auto px-4 flex items-center justify-between">
                <Link href="/landing" className="text-xl font-bold">
                    Logo
                </Link>
                <nav className="flex items-center gap-4">
                    <Button variant="ghost" asChild>
                        <Link href="/login">로그인</Link>
                    </Button>
                    <Button asChild>
                        <Link href="/signup">회원가입</Link>
                    </Button>
                </nav>
            </div>
        </header>
    );
}
