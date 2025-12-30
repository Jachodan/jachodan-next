/**
 * 파일 업로드 유틸리티
 *
 * 1. uploadFile: 에디터에서 이미지 선택 시 Blob URL로 미리보기 (즉시)
 * 2. uploadFileToServer: 폼 제출 시 실제 서버 업로드
 */

// API 엔드포인트 - 실제 URL로 변경 필요
const UPLOAD_API_URL = process.env.NEXT_PUBLIC_API_URL + '/api/files/upload' || '/api/files/upload';

// 업로드 대기 중인 파일들을 저장 (Blob URL -> File 매핑)
const pendingUploads = new Map<string, File>();

/**
 * 에디터에서 이미지 선택 시 호출 - Blob URL로 즉시 미리보기 + 프로그레스 바
 */
export async function uploadFile(
    file: File,
    onProgress?: (event: { progress: number }) => void
): Promise<{ fileName: string; fileSize: string; src: string }> {
    // Blob URL 생성 (로컬 미리보기용)
    const blobUrl = URL.createObjectURL(file);

    // 나중에 서버 업로드를 위해 저장
    pendingUploads.set(blobUrl, file);

    // 프로그레스 시뮬레이션
    if (onProgress) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            if (progress <= 100) {
                onProgress({ progress });
            }
            if (progress >= 100) {
                clearInterval(interval);
            }
        }, 200);
    }

    // 2초 딜레이 (업로드 시뮬레이션)
    await new Promise((r) => setTimeout(r, 2000));

    return {
        fileName: file.name,
        fileSize: formatBytes(file.size),
        src: blobUrl,
    };
}

/**
 * 폼 제출 시 실제 서버로 업로드
 * @param blobUrl - 에디터에서 사용 중인 Blob URL
 * @returns 서버에서 반환한 실제 URL
 */
export async function uploadFileToServer(
    blobUrl: string,
    onProgress?: (event: { progress: number }) => void
): Promise<string> {
    const file = pendingUploads.get(blobUrl);
    if (!file) {
        throw new Error('File not found for blob URL');
    }

    const formData = new FormData();
    formData.append('file', file);

    const result = await new Promise<{ url: string }>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        if (onProgress) {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const progress = Math.round((event.loaded / event.total) * 100);
                    onProgress({ progress });
                }
            });
        }

        xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    resolve(response);
                } catch {
                    reject(new Error('Invalid JSON response'));
                }
            } else {
                reject(new Error(`Upload failed: ${xhr.status}`));
            }
        });

        xhr.addEventListener('error', () => {
            reject(new Error('Network error'));
        });

        xhr.open('POST', UPLOAD_API_URL);
        // TODO: 인증 헤더 추가 필요시
        // xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
    });

    // 업로드 완료 후 정리
    pendingUploads.delete(blobUrl);
    URL.revokeObjectURL(blobUrl);

    return result.url; // TODO: 서버 응답 형식에 맞게 수정
}

/**
 * 에디터 콘텐츠에서 모든 Blob URL을 서버 URL로 변환
 */
export async function uploadAllPendingFiles(
    content: unknown,
    onProgress?: (current: number, total: number) => void
): Promise<unknown> {
    const blobUrls = Array.from(pendingUploads.keys());
    const total = blobUrls.length;

    if (total === 0) return content;

    let contentStr = JSON.stringify(content);

    for (let i = 0; i < blobUrls.length; i++) {
        const blobUrl = blobUrls[i];
        const serverUrl = await uploadFileToServer(blobUrl);
        contentStr = contentStr.replace(new RegExp(escapeRegex(blobUrl), 'g'), serverUrl);

        if (onProgress) {
            onProgress(i + 1, total);
        }
    }

    return JSON.parse(contentStr);
}

/**
 * Blob URL 정리 (컴포넌트 언마운트 시 호출)
 */
export function cleanupPendingUploads(): void {
    pendingUploads.forEach((_, blobUrl) => {
        URL.revokeObjectURL(blobUrl);
    });
    pendingUploads.clear();
}

function escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatBytes(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default uploadFile;
