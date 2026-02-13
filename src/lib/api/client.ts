const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface ApiResponse<T> {
    data: T | null;
    error: string | null;
    status: number;
}

interface ApiRequestOptions extends Omit<RequestInit, "body" | "method"> {
    asJson?: boolean;
}

/**
 * 객체를 FormData로 변환
 * - File/Blob: 그대로 추가
 * - 배열: 같은 key로 여러 번 추가 (Spring @ModelAttribute 호환)
 * - 중첩 객체: JSON 문자열로 변환
 * - null/undefined: 스킵
 */
function objectToFormData(obj: Record<string, unknown>): FormData {
    const formData = new FormData();

    for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) {
            continue;
        }

        if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
        } else if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item instanceof File || item instanceof Blob) {
                    formData.append(key, item);
                } else if (typeof item === "object") {
                    formData.append(key, JSON.stringify(item));
                } else {
                    formData.append(key, String(item));
                }
            });
        } else if (typeof value === "object") {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    }

    return formData;
}

/**
 * body를 전송 가능한 형태로 변환
 * - asJson: true → JSON 문자열로 변환
 * - FormData: 그대로 사용
 * - 일반 객체: FormData로 변환 (기본)
 */
function prepareBody(body: unknown, asJson?: boolean): {
    body: BodyInit | undefined;
    contentType: string | undefined;
} {
    if (body === null || body === undefined) {
        return { body: undefined, contentType: undefined };
    }

    if (body instanceof FormData) {
        return { body, contentType: undefined };
    }

    if (asJson) {
        return { body: JSON.stringify(body), contentType: "application/json" };
    }

    // 기본: FormData로 변환 (Content-Type은 브라우저가 자동 설정)
    const formData = objectToFormData(body as Record<string, unknown>);
    return { body: formData, contentType: undefined };
}

async function apiClient<T>(
    endpoint: string,
    options?: RequestInit & { contentType?: string }
): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
        const headers: HeadersInit = {
            ...(options?.contentType && { "Content-Type": options.contentType }),
            ...options?.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            return {
                data: null,
                error: `HTTP ${response.status}: ${response.statusText}`,
                status: response.status,
            };
        }

        // 204 No Content인 경우 body 없이 성공 반환
        if (response.status === 204) {
            return { data: null, error: null, status: response.status };
        }

        // response body를 text로 먼저 읽어서 빈 응답 처리
        const text = await response.text();
        if (!text) {
            return { data: null, error: null, status: response.status };
        }

        try {
            const data = JSON.parse(text);
            return { data, error: null, status: response.status };
        } catch {
            // JSON 파싱 실패 시에도 2xx면 성공으로 처리
            return { data: null, error: null, status: response.status };
        }
    } catch (error) {
        return {
            data: null,
            error: error instanceof Error ? error.message : "Unknown error",
            status: 0,
        };
    }
}

export const api = {
    get: <T>(endpoint: string, options?: ApiRequestOptions) =>
        apiClient<T>(endpoint, { ...options, method: "GET" }),

    post: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => {
        const { body: preparedBody, contentType } = prepareBody(body, options?.asJson);
        return apiClient<T>(endpoint, {
            ...options,
            method: "POST",
            body: preparedBody,
            contentType,
        });
    },

    put: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => {
        const { body: preparedBody, contentType } = prepareBody(body, options?.asJson);
        return apiClient<T>(endpoint, {
            ...options,
            method: "PUT",
            body: preparedBody,
            contentType,
        });
    },

    patch: <T>(endpoint: string, body?: unknown, options?: ApiRequestOptions) => {
        const { body: preparedBody, contentType } = prepareBody(body, options?.asJson);
        return apiClient<T>(endpoint, {
            ...options,
            method: "PATCH",
            body: preparedBody,
            contentType,
        });
    },

    delete: <T>(endpoint: string, options?: ApiRequestOptions) =>
        apiClient<T>(endpoint, { ...options, method: "DELETE" }),
};
