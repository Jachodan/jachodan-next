import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import KakaoProvider from "next-auth/providers/kakao";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080";

export const authOptions: NextAuthOptions = {
    providers: [
        {
            id: "naver",
            name: "Naver",
            type: "oauth",
            clientId: process.env.NAVER_CLIENT_ID!,
            clientSecret: process.env.NAVER_CLIENT_SECRET!,
            authorization: {
                url: "https://nid.naver.com/oauth2.0/authorize",
                params: { scope: "" },
            },
            token: "https://nid.naver.com/oauth2.0/token",
            userinfo: "https://openapi.naver.com/v1/nid/me",
            profile(profile) {
                return {
                    id: profile.response.id,
                    name: profile.response.name,
                    email: profile.response.email,
                    image: profile.response.profile_image,
                };
            },
        },
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID!,
            clientSecret: process.env.KAKAO_CLIENT_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ account }) {
            if (!account?.access_token || !account?.provider) {
                return true;
            }

            try {
                // 1) Spring 백엔드에 provider + accessToken 전달 → 티켓 발급
                const params = new URLSearchParams({
                    provider: account.provider.toUpperCase(),
                    accessToken: account.access_token,
                });

                const completeRes = await fetch(
                    `${BACKEND_URL}/auth/social/complete`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: params.toString(),
                    }
                );

                if (!completeRes.ok) {
                    console.error("social/complete failed:", completeRes.status);
                    return false;
                }

                const completeData = await completeRes.json();
                if (!completeData.success || !completeData.ticketKey) {
                    console.error("social/complete returned failure:", completeData);
                    return false;
                }

                // 2) 티켓 소비 → Spring 세션 생성
                const consumeRes = await fetch(
                    `${BACKEND_URL}/auth/social/consume?key=${completeData.ticketKey}`,
                    { method: "GET" }
                );

                if (!consumeRes.ok) {
                    console.error("social/consume failed:", consumeRes.status);
                    return false;
                }

                const consumeData = await consumeRes.json();
                if (!consumeData.success) {
                    console.error("social/consume returned failure:", consumeData);
                    return false;
                }

                // 3) Set-Cookie에서 JSESSIONID 추출
                const setCookie = consumeRes.headers.get("set-cookie");
                const sessionId = extractSessionId(setCookie);

                // account에 임시 저장 (jwt 콜백에서 사용)
                (account as Record<string, unknown>).backendSessionId = sessionId;
                (account as Record<string, unknown>).storeId = consumeData.storeId;

                return true;
            } catch (error) {
                console.error("Backend auth error:", error);
                return false;
            }
        },

        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
                token.provider = account.provider;
                token.backendSessionId = (account as Record<string, unknown>).backendSessionId as string | undefined;
                token.storeId = (account as Record<string, unknown>).storeId as number | undefined;
            }
            return token;
        },

        async session({ session, token }) {
            session.provider = token.provider;
            session.backendSessionId = token.backendSessionId;
            session.storeId = token.storeId;
            return session;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            if (url.startsWith(baseUrl)) return url;
            return `${baseUrl}/home`;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};

function extractSessionId(setCookie: string | null): string | undefined {
    if (!setCookie) return undefined;
    const match = setCookie.match(/JSESSIONID=([^;]+)/);
    return match?.[1];
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
