"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

const PROTECTED_PATHS = ["/home", "/items", "/settings", "/schedule"];

function AuthGuard({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (status !== "authenticated") return;

        // 백엔드 세션이 없는데 보호 페이지에 있으면 로그아웃
        if (!session?.backendSessionId) {
            if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
                signOut({ callbackUrl: "/login" });
            }
        }
    }, [status, session, pathname, router]);

    return <>{children}</>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <AuthGuard>{children}</AuthGuard>
        </SessionProvider>
    );
}
