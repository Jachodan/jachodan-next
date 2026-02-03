// 프록시를 통해 API 호출 (CORS 우회)
// CORS 해결 후: process.env.NEXT_PUBLIC_API_URL || "" 로 변경
const API_BASE_URL = "/api/proxy";

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

async function apiClient<T>(
    endpoint: string,
    options?: RequestInit
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                ...options?.headers,
            },
        });

        if (!response.ok) {
            return {
                data: null,
                error: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status,
            };
        }

        // 204 No Content 또는 빈 응답 처리
        if (response.status === 204 || response.headers.get("content-length") === "0") {
            return { data: null, error: null, status: response.status };
        }

        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        return { data, error: null, status: response.status };
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            status: 0,
        };
    }
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiClient<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: "POST",
            body: JSON.stringify(body),
        }),

    put: <T>(endpoint: string, body: unknown, options?: RequestInit) =>
        apiClient<T>(endpoint, {
            ...options,
            method: "PUT",
            body: JSON.stringify(body),
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
