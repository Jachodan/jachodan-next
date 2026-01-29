import { NextRequest, NextResponse } from "next/server";

// 서버 사이드에서만 접근 (NEXT_PUBLIC 아님)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const pathname = path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${API_BASE_URL}/${pathname}${searchParams ? `?${searchParams}` : ""}`;

    try {
        const response = await fetch(url, {
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy GET error:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const url = `${API_BASE_URL}/${path.join("/")}`;
    const body = await request.json();

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy POST error:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const url = `${API_BASE_URL}/${path.join("/")}`;
    const body = await request.json();

    try {
        const response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy PUT error:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    const url = `${API_BASE_URL}/${path.join("/")}`;

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Proxy DELETE error:", error);
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}
