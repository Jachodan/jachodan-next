import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

const BACKEND_URL = process.env.BACKEND_API_URL || "http://localhost:8080";

async function proxyRequest(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const session = await getServerSession(authOptions);
    const targetPath = path.join("/");
    const url = new URL(`${BACKEND_URL}/${targetPath}`);

    request.nextUrl.searchParams.forEach((value, key) => {
        url.searchParams.set(key, value);
    });

    const headers: HeadersInit = {
        "Content-Type": request.headers.get("Content-Type") || "application/json",
    };

    if (session?.backendSessionId) {
        headers["Cookie"] = `JSESSIONID=${session.backendSessionId}`;
    }

    const fetchOptions: RequestInit = {
        method: request.method,
        headers,
    };

    if (request.method !== "GET" && request.method !== "HEAD") {
        try {
            fetchOptions.body = await request.text();
        } catch {
            // body가 없는 경우
        }
    }

    try {
        const res = await fetch(url.toString(), fetchOptions);
        const data = await res.text();

        return new NextResponse(data, {
            status: res.status,
            headers: {
                "Content-Type": res.headers.get("Content-Type") || "application/json",
            },
        });
    } catch {
        return NextResponse.json(
            { error: "Backend unavailable" },
            { status: 502 }
        );
    }
}

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(request, context);
}

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(request, context);
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(request, context);
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    return proxyRequest(request, context);
}
