import "next-auth";

declare module "next-auth" {
    interface Session {
        provider?: string;
        backendSessionId?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        provider?: string;
        accessToken?: string;
        backendSessionId?: string;
    }
}
