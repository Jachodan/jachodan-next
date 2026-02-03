import "next-auth";

declare module "next-auth" {
    interface Session {
        provider?: string;
        backendSessionId?: string;
        storeId?: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        provider?: string;
        accessToken?: string;
        backendSessionId?: string;
        storeId?: number;
    }
}
